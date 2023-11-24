import { Controller, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: AuthLoginDto) {
        return this.authService.login(body.email, body.password)
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDto) {
        return this.authService.register(body)
    }

    @Post('forgot')
    async forgotPassword(@Body() body: AuthForgotPasswordDto) {
        return this.authService.forgotPassword(body.email)
    }

    @Post('reset')
    async reset(@Body() body: AuthResetPasswordDto) {
        return this.authService.resetPassword(body.password, body.token)
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User('email') user) {
        return { user }
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async photoUpload(@User() user, @UploadedFile() photo: Express.Multer.File) {
        const result = await writeFile(join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.png`), photo.buffer)
        
        return {success: true}
    }
}
