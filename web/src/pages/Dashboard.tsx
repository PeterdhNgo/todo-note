import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {api, clearToken} from '../lib/api';
import type {Note} from '../lib/types';
import NoteEditor, {type NoteDraft} from '../components/NoteEditor';

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'text' | 'checklist' | null>(null);
  const navigate = useNavigate();
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  async function handleCreate(draft: NoteDraft) {
    await api('/notes', {method: 'POST', body: draft});
    setEditorMode(null);
    await loadNotes();
  }

  async function handleUpdate(draft: NoteDraft) {
  if (!editingNote) return;
  await api(`/notes/${editingNote.id}`, { method: 'PATCH', body: draft });
  setEditingNote(null);
  await loadNotes();
}

async function handleDelete(id: string) {
  if (!confirm('Delete this note?')) return;
  await api(`/notes/${id}`, { method: 'DELETE' });
  await loadNotes();
}

async function handleToggle(noteId: string, itemId: string) {
  await api(`/notes/${noteId}/items/${itemId}/toggle`, { method: 'PATCH' });
  await loadNotes();
}

  async function loadNotes() {
    setError(null);
    try {
      const data = await api<Note[]>('/notes');
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load notes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  function handleLogout() {
    clearToken();
    navigate('/login');
  }

  return (
    <div>
      <header>
        <button onClick={() => setEditorMode('text')}>New Text Note</button>
        <button onClick={() => setEditorMode('checklist')}>New Checklist</button>

        <h1>TodoNote</h1>
        <button onClick={handleLogout}>Log out</button>
      </header>

      {loading && <p>Loading notes…</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && notes.length === 0 && (
        <p>No notes yet. Create your first one.</p>
      )}

      <div>
        {notes.map((note) => (
          <article key={note.id}>
  <h2>{note.title || 'Untitled'}</h2>
  {note.content && <p>{note.content}</p>}
  {note.items.length > 0 && (
    <ul>
      {note.items.map((item) => (
        <li key={item.id}>
          <input
            type="checkbox"
            checked={item.isChecked}
            onChange={() => handleToggle(note.id, item.id)}
          />
          <span style={{ textDecoration: item.isChecked ? 'line-through' : 'none' }}>
            {item.content}
          </span>
        </li>
      ))}
    </ul>
  )}
  <small>{new Date(note.updatedAt).toLocaleString()}</small>
  <button onClick={() => setEditingNote(note)}>Edit</button>
  <button onClick={() => handleDelete(note.id)}>Delete</button>
</article>
        ))}
      </div>
      {editorMode && (
        <NoteEditor mode={editorMode} onSave={handleCreate} onCancel={() => setEditorMode(null)} />
      )}
      {editingNote && (
        <NoteEditor
          mode={editingNote.items.length > 0 ? 'checklist' : 'text'}
    initial={{
      title: editingNote.title,
      content: editingNote.content,
      colour: editingNote.colour,
      items: editingNote.items.map((i) => ({ content: i.content, isChecked: i.isChecked })),
    }}
    onSave={handleUpdate}
    onCancel={() => setEditingNote(null)}
  />
      )}
    </div>
  );
}