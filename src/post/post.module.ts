import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/auth.entity';
import { AuthModule } from '../auth/auth.module';
import { CommentLike } from './comment-like.entity';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostLike, Comment, CommentLike, Auth]),
    AuthModule,
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
