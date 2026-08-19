import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Note} from "./notes.entity";
import {Index} from "typeorm/decorator/Index";

@Entity('note_items')
export class NoteItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    
    @Index()
    @Column({name: 'note_id'})
    noteId!: string;

    @ManyToOne(() => Note, (note) => note.items, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'note_id'})
    note!: Note;

    @Column()
    content!: string;

    @Column({name: 'is_checked', default: false})
    isChecked!: boolean;

    @Column({type: 'int', default: 0})
    position!: number;
}