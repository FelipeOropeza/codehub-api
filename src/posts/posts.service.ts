import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) {}

    async createPost(data: { title: string; code: string; language: string; authorId: string }) {
        await this.prisma.post.create({
            data: {
                title: data.title,
                code: data.code,
                language: data.language,
                authorId: data.authorId
            }
        });
        
        return { message: 'Post criado com sucesso' };
    }
}