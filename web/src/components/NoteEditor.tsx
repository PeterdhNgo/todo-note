import { useState, type SubmitEvent } from 'react';
import { NOTE_COLOURS, type NoteColour } from '../lib/types';


export interface NoteDraft {
  title: string;
  content: string;
  colour: NoteColour;
  items: { content: string; isChecked: boolean }[];
}

interface Props {
  mode: 'text' | 'checklist';
  initial?: NoteDraft;
  onSave: (draft: NoteDraft) => Promise<void>;
  onCancel: () => void;
}

export default function NoteEditor({ mode, initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [colour, setColour] = useState<NoteColour>(initial?.colour ?? 'yellow');
  const [items, setItems] = useState(initial?.items ?? [{ content: '', isChecked: false }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateItem(index: number, patch: Partial<{ content: string; isChecked: boolean }>) {
    setItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSave({
        title,
        content: mode === 'text' ? content : '',
        colour,
        items: mode === 'checklist' ? items.filter((i) => i.content.trim() !== '') : [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save note.');
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
        <form className="modal" onSubmit={handleSubmit}>
    <header className="modal-header">
      <button className="btn-ghost" type="button" onClick={onCancel}>Cancel</button>
      <h2>{mode === 'text' ? 'New Text Note' : 'New Checklist'}</h2>
      <button className="btn-save" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
    </header>

    <div className="field">
      <label htmlFor="title">Title</label>
      <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
    </div>

        {mode === 'text' ? (
          <div className="field">
  <label htmlFor="content">Content</label>
  <textarea id="content" rows={6} value={content}
    onChange={(e) => setContent(e.target.value)} />
</div>
        ) : (
          <div className="field">
    <label>Checklist Items</label>
    {items.map((item, index) => (
      <div className="item-row" key={index}>
        <input type="checkbox" checked={item.isChecked}
          onChange={(e) => updateItem(index, { isChecked: e.target.checked })} />
        <input value={item.content}
          onChange={(e) => updateItem(index, { content: e.target.value })} />
        <button className="btn-icon" type="button" onClick={() => removeItem(index)}>✕</button>
      </div>
    ))}
    <button className="btn-ghost" type="button"
      onClick={() => setItems([...items, { content: '', isChecked: false }])}>
      + Add item
    </button>
  </div>
        )}

        <div className="field">
  <label>Choose Note Color</label>
  <div className="swatches">
    {NOTE_COLOURS.map((c) => (
      <button key={c} type="button" className="swatch"
        style={{ background: `var(--note-${c})` }}
        onClick={() => setColour(c)} aria-pressed={colour === c} aria-label={c} />
    ))}
  </div>
</div>
        <div className="form-error">
          {error && <p role="alert">{error}</p>}
        </div>
      </form>
    </div>
  );
}