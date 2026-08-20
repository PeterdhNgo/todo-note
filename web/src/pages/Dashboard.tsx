import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {api, clearToken} from '../lib/api';
import type {Note} from '../lib/types';
import NoteEditor, {type NoteDraft} from '../components/NoteEditor';
import NoteViewer from '../components/NoteViewer';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [editorMode, setEditorMode] = useState<'text' | 'checklist' | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
    
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
  try {
    await api(`/notes/${noteId}/items/${itemId}/toggle`, { method: 'PATCH' });
    const data = await api<Note[]>('/notes');
    setNotes(data);
    setViewingNote((current) =>
      current ? data.find((n) => n.id === current.id) ?? null : null
    );
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Could not update item.');
  }
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
    <div className="layout">
    <aside className="sidebar">
      <div className="brand">
        <h1>TodoNote</h1>
        <span>DESKTOP V1.0</span>
      </div>
      <div className="sidebar-actions">
        <button className="btn-new" onClick={() => setEditorMode('text')}>+ New Text Note</button>
        <button className="btn-new" onClick={() => setEditorMode('checklist')}>+ New Checklist</button>
      </div>
    </aside>

    <main className="main">
      <div className="topbar">
        <button className="btn-ghost" onClick={handleLogout}>Log out</button>
      </div>

      {loading && <p className="empty-state">Loading notes…</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {!loading && !error && notes.length === 0 && (
        <p className="empty-state">No notes yet. Create your first one.</p>
      )}

      <div className="note-grid">
        {notes.map((note) => (
          <article key={note.id} className={`note-card note-${note.colour}`} onClick={() => setViewingNote(note)}>
            <h2>{note.title || 'Untitled'}</h2>
            <span className="note-time">{new Date(note.updatedAt).toLocaleString()}</span>
            {note.content && <p className="note-body">{note.content}</p>}
            {note.items.length > 0 && (
  <>
    <ul className="note-items">
      {note.items.slice(0, 5).map((item) => (
        <li key={item.id} onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={item.isChecked}
            onChange={() => handleToggle(note.id, item.id)} />
          <span className={item.isChecked ? 'item-done' : ''}>{item.content}</span>
        </li>
      ))}
    </ul>
    {note.items.length > 5 && (
      <span className="note-time">+{note.items.length - 5} more</span>
    )}
  </>
            )}
            <div className="note-actions" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setEditingNote(note)}>Edit</button>
              <button onClick={() => handleDelete(note.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </main>

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

    {viewingNote && (
  <NoteViewer
    note={viewingNote}
    onClose={() => setViewingNote(null)}
    onEdit={() => { setEditingNote(viewingNote); setViewingNote(null); }}
    onDelete={async () => { setViewingNote(null); await handleDelete(viewingNote.id); }}
    onToggle={(itemId) => handleToggle(viewingNote.id, itemId)}
  />
)}
  </div>
  );
}