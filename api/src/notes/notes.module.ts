import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './notes.entity';
import { NoteItem } from './note-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, NoteItem])],
  controllers: [NotesController],
  providers: [NotesService]
})
export class NotesModule {}
