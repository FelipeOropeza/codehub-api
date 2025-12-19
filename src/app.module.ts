import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import { CommentsModule } from './comments/comments.module'
import { LikesModule } from './likes/likes.module'
import { FollowsModule } from './follows/follows.module'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    FollowsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ]
})
export class AppModule {}
