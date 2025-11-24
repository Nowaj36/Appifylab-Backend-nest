import {
  Body,
  Controller,
  Delete,
  Get,
  Post as HttpPost,
  Param,
  ParseIntPipe,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

import type { Auth } from '../auth/auth.entity';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../common/guards/access-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

const uploadDir = join(__dirname, '..', '..', 'uploads');
const storage = diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = file.originalname.split('.').pop() || 'bin';
    cb(null, `${Date.now()}-${uuidv4()}.${ext}`);
  },
});

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Create a new post with optional image
  @HttpPost()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage }))
  async create(
    @Body() dto: CreatePostDto,
    @GetUser() user: Auth,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    const created = await this.postService.create(dto, imageUrl, user);
    return { success: true, data: created };
  }

  // Get posts feed for user (public + private)
  @Get('feed')
  @UseGuards(JwtAuthGuard)
  async feed(
    @GetUser('id') userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const res = await this.postService.getFeed(
      userId,
      Number(page),
      Number(limit),
    );
    return { success: true, ...res };
  }

  // Get single post by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.findById(id);
    return { success: true, data: post };
  }

  // Delete a post
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    const res = await this.postService.delete(id, userId);
    return { success: true, ...res };
  }

  // Like/Unlike a post
  @HttpPost(':postId/like')
  @UseGuards(JwtAuthGuard)
  async toggleLikePost(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser() user: { id: number },
  ) {
    return this.postService.toggleLikePost(postId, user.id);
  }

  // Add comment to a post
  @HttpPost(':postId/comment')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body('content') content: string,
    @GetUser() user: { id: number },
  ) {
    const comment = await this.postService.addComment(postId, content, user.id);
    return { success: true, data: comment };
  }

  // Reply to a comment
  @HttpPost('comment/:commentId/reply')
  @UseGuards(JwtAuthGuard)
  async replyToComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body('content') content: string,
    @GetUser() user: { id: number },
  ) {
    const reply = await this.postService.addReply(commentId, content, user.id);
    return { success: true, data: reply };
  }

  // Like / Unlike a comment
  @HttpPost('comment/:commentId/like')
  @UseGuards(JwtAuthGuard)
  async toggleLikeComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @GetUser('id') userId: number,
  ) {
    const res = await this.postService.toggleLikeComment(commentId, userId);
    return { success: true, data: res };
  }
}
