import { Controller, Get, Post, UseGuards, Body, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  // @UseGuards(JwtAuthGuard)
  // @Get('me')
  // me(@CurrentUser() user: { userId: string }) {
  //   return user;
  // }

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
