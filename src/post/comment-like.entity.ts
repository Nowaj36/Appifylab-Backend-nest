import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auth } from '../auth/auth.entity';
import { Comment } from './comment.entity';

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: 'CASCADE' })
  comment: Comment;

  @ManyToOne(() => Auth, { eager: true })
  user: Auth;

  @CreateDateColumn()
  createdAt: Date;
}
