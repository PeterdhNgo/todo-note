import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}
    
    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('That email is already registered.');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create(dto.email, passwordHash);
        return { id: user.id, email: user.email};
    }

    async login(dto: LoginDto){
        const user = await this.usersService.findByEmail(dto.email);
        if(!user){
            throw new UnauthorizedException('Invalid Login Credentials!');
        }
        
        const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
        if(!passwordMatches){
            throw new UnauthorizedException('Invalid Login Credentials');
        }

        const token = await this.jwtService.signAsync({sub: user.id, email: user.email});
        return {access_token: token};
    }
}