import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common'
import { FollowsService } from './follows.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@UseGuards(JwtAuthGuard)
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':userId')
  follow(
    @CurrentUser('id') userId: string,
    @Param('userId') targetUserId: string,
  ) {
    return this.followsService.follow(userId, targetUserId)
  }

  @Delete(':userId')
  unfollow(
    @CurrentUser('id') userId: string,
    @Param('userId') targetUserId: string,
  ) {
    return this.followsService.unfollow(userId, targetUserId)
  }

  @Get(':userId/followers')
  followers(@Param('userId') userId: string) {
    return this.followsService.followers(userId)
  }

  @Get(':userId/following')
  following(@Param('userId') userId: string) {
    return this.followsService.following(userId)
  }

  @Get(':userId/is-following')
  isFollowing(
    @CurrentUser('id') userId: string,
    @Param('userId') targetUserId: string,
  ) {
    return this.followsService.isFollowing(userId, targetUserId)
  }
}
