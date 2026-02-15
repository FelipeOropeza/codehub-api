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

  async getPostsByUser(profileUserId: string, currentUserId?: string) {
    const posts = await this.prisma.post.findMany({
      where: { authorId: profileUserId },
      include: {
        _count: {
          select: { likes: true, comments: true },
        },
        likes: currentUserId
          ? {
              where: { userId: currentUserId },
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
      likedByMe: currentUserId ? post.likes.length > 0 : false,
      likes: undefined,
    }));
  }

  async getAllPosts(userId?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [posts, totalPosts] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
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
      }),
      this.prisma.post.count(),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    const postsWithLikedByMe = posts.map((post) => ({
      ...post,
      likedByMe: userId ? post.likes.length > 0 : false,
      likes: undefined,
    }));

    return {
      posts: postsWithLikedByMe,
      totalPages,
    };
  }
}
