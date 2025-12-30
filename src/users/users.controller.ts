import {
  Controller,
  Get,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Body,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateProfileDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    let avatarUrl: string | undefined;

    if (avatar) {
      const upload = await this.cloudinaryService.uploadFromBuffer(
        avatar.buffer,
        'codehub/avatars',
      );

      avatarUrl = upload.secure_url;
    }

    return this.userService.updateProfile(user.userId, {
      ...dto,
      ...(avatarUrl && { avatar: avatarUrl }),
    });
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  deleteUser(@Body('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserByEmail(@Body('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
