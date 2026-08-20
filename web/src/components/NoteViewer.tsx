import type { Note } from '../lib/types';

interface Props {
  note: Note;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (itemId: string) => void;
}

export default function NoteViewer({ note, onClose, onEdit, onDelete, onToggle }: Props) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className={`modal note-${note.colour}`} onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <button className="btn-ghost" type="button" onClick={onClose}>← Dashboard</button>
          <div className="note-actions">
            <button type="button" onClick={onEdit} aria-label="Edit note">Edit</button>
            <button type="button" onClick={onDelete} aria-label="Delete note">Delete</button>
          </div>
        </header>

        <h2 className="viewer-title">{note.title || 'Untitled'}</h2>
        <span className="note-time">
          {new Date(note.updatedAt).toLocaleString()} ·{' '}
          {note.items.length > 0 ? 'Checklist note' : 'Text note'}
        </span>

        {note.content && <p className="note-body-full">{note.content}</p>}

        {note.items.length > 0 && (
          <ul className="note-items">
            {note.items.map((item) => (
              <li key={item.id}>
                <input type="checkbox" checked={item.isChecked}
                  onChange={() => onToggle(item.id)} />
                <span className={item.isChecked ? 'item-done' : ''}>{item.content}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}