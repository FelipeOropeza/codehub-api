import { Controller, Get, Post, UseGuards, Body, Delete, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@CurrentUser() user: { userId: string }, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(user.userId, dto);
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
