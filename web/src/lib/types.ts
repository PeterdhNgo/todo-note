export const NOTE_COLOURS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'] as const;
export type NoteColour = (typeof NOTE_COLOURS)[number];

export interface NoteItem {
  id: string;
  noteId: string;
  content: string;
  isChecked: boolean;
  position: number;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  colour: NoteColour;
  items: NoteItem[];
  createdAt: string;
  updatedAt: string;
}