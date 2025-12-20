import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createPost(@Body() dto: CreatePostDto) {
    return this.postService.createPost(dto);
  }
}
