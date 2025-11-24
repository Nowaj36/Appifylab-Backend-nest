/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { generateTokens } from '../common/utils/jwt';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly repo: AuthRepository) { }

  async register(dto: RegisterDto) {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.repo.createUser({ ...dto, password: hash });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.repo.findByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new BadRequestException('Invalid password');

    const tokens = generateTokens({ id: user.id });

    return { ...tokens };
  }
}
