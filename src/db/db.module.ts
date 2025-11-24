import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Auth } from '../auth/auth.entity';
import { CommentLike } from '../post/comment-like.entity';
import { Comment } from '../post/comment.entity';
import { PostLike } from '../post/post-like.entity';
import { Post } from '../post/post.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'appilab_social_app',
      entities: [Auth, Post, PostLike, Comment, CommentLike],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class DbModule {}
