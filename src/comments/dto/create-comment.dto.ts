import { IsString, IsUUID, MinLength } from 'class-validator'

export class CreateCommentDto {
  @IsUUID()
  postId: string

  @IsString()
  @MinLength(1)
  content: string
}
