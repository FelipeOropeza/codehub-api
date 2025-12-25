import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@Controller('comments')
export class CommentsController {
  constructor(private service: CommentsService) {}

  // criar comentário
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.service.create(user.userId, dto.postId, dto.content)
  }

  // listar comentários do post (público)
  @Get('post/:postId')
  getByPost(@Param('postId') postId: string) {
    return this.service.getPostById(postId)
  }

  // deletar comentário
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.service.delete(id, user.userId)
  }
}
