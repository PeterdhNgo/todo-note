import {Type} from 'class-transformer';
import {IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, ValidateNested, MaxLength,
} from 'class-validator';
import {NOTE_COLOURS} from '../notes.entity';

export class NoteItemDto {
    @IsString()
    @MaxLength(500)
    content!: string;
    
    @IsOptional()
    @IsBoolean()
    isChecked?: boolean;

    @IsOptional()
    @IsInt()
    position?: number;
}

export class CreateNoteDto {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsIn(NOTE_COLOURS)
    colour?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => NoteItemDto)
    items?: NoteItemDto[];
}