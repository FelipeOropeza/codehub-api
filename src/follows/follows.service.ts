import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async follow(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('Você não pode seguir a si mesmo')
    }

    return this.prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
      },
    })
  }

  async unfollow(userId: string, targetUserId: string) {
    return this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    })
  }

  async followers(userId: string) {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })
  }

  async following(userId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })
  }

  async isFollowing(userId: string, targetUserId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    })

    return Boolean(follow)
  }
}
