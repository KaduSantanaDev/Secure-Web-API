import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception'
import { users } from '@prisma/client';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService, private readonly userService: UserService, private readonly mailerService: MailerService) {
        
    }

    createToken(user: users, expiration="7 days", issuer='login', audience='users') {
        return {
            accessToken: this.jwtService.sign({
                sub: user.id,
                name: user.name,
                email: user.email
            }, {
                expiresIn: expiration,
                issuer,
                audience
            })
        } 
    }

    checkToken(token: string) {
        try {
            const data = this.jwtService.verify(token, {
                issuer: 'login',
                audience: 'users'
           })

           return data
        } catch (error) {
            throw new BadRequestException(error)
        }
        
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token)
            return true
        } catch(e) {
            return false
        }
    }

    async login(email: string, password: string) {
        const user = await this.prismaService.users.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            throw new UnauthorizedException('Incorrect email or password')
        }

        if(!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Incorrect email or password')
        }

        return this.createToken(user)
    }

    async forgotPassword(email: string) {
        const user = await this.prismaService.users.findFirst({
            where: {
                email,
            }
        })

        

        if (!user) {
            throw new UnauthorizedException('Incorrect email')
        }

        const token = this.createToken(user, '30 minutes', 'forget', 'users')

        await this.mailerService.sendMail({
            subject: 'Recuperação de senha',
            to: 'mariane52@ethereal.email',
            template: 'forget',
            context: {
                name: user.name,
                token: token.accessToken
            }
        })
        
        return true

    }

    async resetPassword(password: string, token: string){

        const data: any = this.jwtService.verify(token, {
            issuer: 'forget',
            audience: 'users',
        })


        if(isNaN(Number(data.sub))) {
            throw new BadRequestException('Invalid token')
        }

        const salt = await bcrypt.genSalt()
        password = await bcrypt.hash(password, salt)

        const user = await this.prismaService.users.update({
            where: {
                id: Number(data.sub)
            },
            data: {
                password
            }
        })

        return this.createToken(user)
    }

    async register(data: AuthRegisterDto) {
        const user = await this.userService.create(data)

        return this.createToken(user)
    }
}
