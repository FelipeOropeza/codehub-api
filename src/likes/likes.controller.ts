import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  toggle(@Param('postId') postId: string, @CurrentUser() user: { userId: string }) {
    return this.likesService.toggleLike(postId, user.userId);
  }
}
