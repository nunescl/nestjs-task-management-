import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  public repo: Repository<User>;

  constructor(private dataSource: DataSource) {
    this.repo = dataSource.getRepository(User);
  }
}
