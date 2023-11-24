import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [JwtModule.register({
        secret: process.env.SECRET
    }), forwardRef(() => UserModule), PrismaModule],
    controllers: [
        AuthController,],
    providers: [
        AuthService,],
    exports: [AuthService]
    
})
export class AuthModule { 
    
}
