import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createPost(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.postService.createPost({
      ...dto,
      authorId: user.userId,
    });
  }
}
