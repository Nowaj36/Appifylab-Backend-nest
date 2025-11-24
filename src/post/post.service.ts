import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../auth/auth.entity';
import { CommentLike } from './comment-like.entity';
import { Comment } from './comment.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostLike } from './post-like.entity';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postLikeRepo: Repository<PostLike>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepo: Repository<CommentLike>,
    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,
  ) {}

  // Create Post
  async create(dto: CreatePostDto, imageUrl: string | undefined, user: Auth) {
    const post = this.postRepo.create({ ...dto, imageUrl, author: user });
    return this.postRepo.save(post);
  }

  // Get Feed (newest first)
  async getFeed(userId: number, page = 1, limit = 20) {
    const [posts, count] = await this.postRepo.findAndCount({
      where: [{ visibility: 'public' }, { author: { id: userId } }],
      order: { createdAt: 'DESC' },
      relations: [
        'author',
        'likes',
        'comments',
        'comments.likes',
        'comments.replies',
        'comments.replies.likes',
      ],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { posts, count };
  }

  // Find Post by ID
  async findById(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: [
        'author',
        'likes',
        'comments',
        'comments.likes',
        'comments.replies',
        'comments.replies.likes',
      ],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  // Delete Post
  async delete(id: number, userId: number) {
    const post = await this.postRepo.findOne({
      where: { id, author: { id: userId } },
    });
    if (!post) throw new NotFoundException('Post not found or unauthorized');
    await this.postRepo.remove(post);
    return { message: 'Post deleted successfully' };
  }

  // Toggle Like Post
  async toggleLikePost(postId: number, userId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.postLikeRepo.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (existingLike) {
      await this.postLikeRepo.remove(existingLike);
      return { liked: false };
    }

    const like = this.postLikeRepo.create({
      post,
      user: { id: userId },
    });

    await this.postLikeRepo.save(like);
    return { liked: true };
  }

  // Add Comment / Reply
  async addComment(
    postId: number | null,
    content: string,
    userId: number,
    parentId?: number,
  ) {
    let post: Post;
    let parentComment: Comment | undefined;

    if (parentId) {
      const maybeParent = await this.commentRepo.findOne({
        where: { id: parentId },
        relations: ['post'],
      });
      if (!maybeParent) throw new NotFoundException('Parent comment not found');
      parentComment = maybeParent;
      post = maybeParent.post;
    } else {
      if (postId === null)
        throw new Error('postId is required for a root comment');
      const maybePost = await this.postRepo.findOne({ where: { id: postId } });
      if (!maybePost) throw new NotFoundException('Post not found');
      post = maybePost;
    }

    // Fetch Auth entity by userId
    const author = await this.authRepo.findOne({ where: { id: userId } });
    if (!author) throw new NotFoundException('User not found');

    const comment = this.commentRepo.create({
      content,
      post,
      author,
      parent: parentComment,
    });

    return this.commentRepo.save(comment);
  }

  // Add Reply
  async addReply(parentId: number, content: string, userId: number) {
    // optional check if parent exists
    const parentExists = await this.commentRepo.findOne({
      where: { id: parentId },
    });
    if (!parentExists)
      throw new NotFoundException('Cannot reply, parent not found');

    return this.addComment(null, content, userId, parentId);
  }

  // Toggle Like Comment
  async toggleLikeComment(commentId: number, userId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    // Check if user exists
    const user = await this.authRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let like = await this.commentLikeRepo.findOne({
      where: { comment: { id: comment.id }, user: { id: user.id } },
      relations: ['user', 'comment'],
    });

    if (like) {
      await this.commentLikeRepo.remove(like);
      return { liked: false };
    } else {
      like = this.commentLikeRepo.create({ comment, user });
      await this.commentLikeRepo.save(like);
      return { liked: true };
    }
  }
}
