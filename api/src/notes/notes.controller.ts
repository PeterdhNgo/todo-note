import {
    Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {NotesService} from "./notes.service";
import {CreateNoteDto} from "./dto/create-note.dto";
import {UpdateNoteDto} from "./dto/update-note.dto";

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  findAll(@Req() req) {
    return this.notesService.findAllForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.notesService.findOneForUser(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateNoteDto, @Req() req) {
    return this.notesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNoteDto, @Req() req) {
    return this.notesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.notesService.remove(id, req.user.id);
  }

  @Patch(':id/items/:itemId/toggle')
  toggleItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Req() req,
  ) {
    return this.notesService.toggleItem(id, itemId, req.user.id);
  }
}