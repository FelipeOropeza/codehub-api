import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(data: {
    title: string;
    code: string;
    language: string;
    authorId: string;
  }) {
    const post = await this.prisma.post.create({
      data: {
        title: data.title,
        code: data.code,
        language: data.language,
        authorId: data.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return post;
  }

  // posts.service.ts
  async getPostById(postId: string, userId?: string) {
    return this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
    });
  }

  async getAllPosts(userId?: string) {
    const posts = await this.prisma.post.findMany({
      include: {
        _count: {
          select: { likes: true, comments: true },
        },
        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map((post) => ({
      ...post,
      likedByMe: userId ? post.likes.length > 0 : false,
      likes: undefined,
    }));
  }
}
