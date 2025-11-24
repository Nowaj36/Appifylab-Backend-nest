import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auth } from '../auth/auth.entity';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  visibility: 'public' | 'private';

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Auth, (auth) => auth.posts, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: Auth;

  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];
}
