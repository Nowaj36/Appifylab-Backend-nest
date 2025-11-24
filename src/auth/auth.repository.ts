import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthRepository {
  private repo: Repository<Auth>;
  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Auth);
  }

  createUser(user: Partial<Auth>) {
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
