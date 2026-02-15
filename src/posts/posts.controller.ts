import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt.guard';
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

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() user?: { userId: string }) {
    return this.postService.getPostById(id, user?.userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/user/:id')
  getPostsByUser(
    @Param('id') profileUserId: string,
    @CurrentUser() user?: { userId: string },
  ) {
    return this.postService.getPostsByUser(profileUserId, user?.userId);
  }
  
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getAll(
    @CurrentUser() user: { userId: string } | undefined,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Res({ passthrough: true }) res: any,
  ) {
    const { posts, totalPages } = await this.postService.getAllPosts(
      user?.userId,
      +page,
      +limit,
    );
    res.header('x-total-pages', totalPages);
    return posts;
  }
}
