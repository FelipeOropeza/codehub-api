import { IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    code: string;

    @IsString()
    language: string;

    @IsString()
    authorId: string;
}