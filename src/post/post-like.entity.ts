import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auth } from '../auth/auth.entity';
import { Post } from './post.entity';

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => Auth, { eager: true })
  user: Auth;

  @CreateDateColumn()
  createdAt: Date;
}
