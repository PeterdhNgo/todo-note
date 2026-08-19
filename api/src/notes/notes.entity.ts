import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import {NoteItem} from './note-item.entity';
import {Index} from 'typeorm/decorator/Index';

export const NOTE_COLOURS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'] as const;
export type NoteColour = typeof NOTE_COLOURS[number];

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({name: 'user_id'})
    userId!: string;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user!: User;

    @Column({default: ''})
    title!: string;

    @Column({type: 'text', default: ''})
    content!: string;

    @Column({type: 'varchar', default: 'yellow'})
    colour!: NoteColour;

    @OneToMany(() => NoteItem, (item) => item.note, {cascade: true})
    items!: NoteItem[];

    @CreateDateColumn({name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt!: Date;
}