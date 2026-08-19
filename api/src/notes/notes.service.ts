import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './notes.entity';
import { NoteItem } from './note-item.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Note)
        private notesRepo: Repository<Note>,
        @InjectRepository(NoteItem)
        private itemsRepo: Repository<NoteItem>,
    ) {}

    findAllForUser(userId: string) {
        return this.notesRepo.find({
            where: { userId },
            relations: {items: true},
            order: {updatedAt: 'DESC', items: {position: 'ASC'}},
        });
    }

    async findOneForUser(id: string, userId: string) {
        const note = await this.notesRepo.findOne({
            where: { id, userId },
            relations: {items: true},
        });
        if (!note) {
            throw new NotFoundException('Note not found');
        }
        return note;
    }

    create(userId: string, dto: CreateNoteDto) {
    const note = this.notesRepo.create({
      userId,
      title: dto.title ?? '',
      content: dto.content ?? '',
      colour: (dto.colour as any) ?? 'yellow',
      items: (dto.items ?? []).map((item, index) =>
        this.itemsRepo.create({
          content: item.content,
          isChecked: item.isChecked ?? false,
          position: item.position ?? index,
        }),
      ),
    });
    return this.notesRepo.save(note);
  }

  async update(id: string, userId: string, dto: UpdateNoteDto) {
    const note = await this.findOneForUser(id, userId);

    if (dto.title !== undefined) note.title = dto.title;
    if (dto.content !== undefined) note.content = dto.content;
    if (dto.colour !== undefined) note.colour = dto.colour as any;

    if (dto.items !== undefined) {
      await this.itemsRepo.delete({ noteId: note.id });
      note.items = dto.items.map((item, index) =>
        this.itemsRepo.create({
          content: item.content,
          isChecked: item.isChecked ?? false,
          position: item.position ?? index,
        }),
      );
    }

    return this.notesRepo.save(note);
  }

  async toggleItem(noteId: string, itemId: string, userId: string) {
    await this.findOneForUser(noteId, userId); //ownership check
    const item = await this.itemsRepo.findOne({ where: { id: itemId, noteId } });
    if (!item) throw new NotFoundException('Item not found');
    item.isChecked = !item.isChecked;
    return this.itemsRepo.save(item);
  }

  async remove(id: string, userId: string) {
    const result = await this.notesRepo.delete({ id, userId });
    if (result.affected === 0) throw new NotFoundException('Note not found');
  }
}




