import { IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Please enter a valid email address.' })
    email!: string;

    @MinLength(10, { message: 'Password must be at least 10 characters long.' })
    password!: string;
}