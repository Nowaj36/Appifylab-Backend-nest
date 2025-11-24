import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auth } from '../auth/auth.entity';
import { Post } from './post.entity';
import { CommentLike } from './comment-like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => Auth, { eager: true })
  author: Auth;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  parent?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @OneToMany(() => CommentLike, (like) => like.comment, { cascade: true })
  likes: CommentLike[];

  @CreateDateColumn()
  createdAt: Date;
}
