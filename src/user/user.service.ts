import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put.dto';
import { UpdatePatchUserDTO } from './dto/update-patch.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createUserDto: CreateUserDTO) {
        createUserDto.password = await bcrypt.hash(createUserDto.password, await bcrypt.genSalt())

        return this.prismaService.users.create({
            data: createUserDto,
        })
    }

    async list() {
        return this.prismaService.users.findMany()
    }

    async show(id: number) {
        await this.verifyIfIdExists(id)
        return this.prismaService.users.findUnique({
            where: {
                id
            }
        })
    }

    async update(id: number, updatePutUserDto: UpdatePutUserDTO) {
        await this.verifyIfIdExists(id)
        if (updatePutUserDto.email === undefined) {
            updatePutUserDto.email = ''
        }

        console.log({updatePutUserDto})

        updatePutUserDto.password = await bcrypt.hash(updatePutUserDto.password, await bcrypt.genSalt())


        return this.prismaService.users.update({
            data: updatePutUserDto,
            where: {
                id
            }
        })
    }

    async updatePartial(id: number, updatePatchUserDto: UpdatePatchUserDTO) {
        await this.verifyIfIdExists(id)

        updatePatchUserDto.password = await bcrypt.hash(updatePatchUserDto.password, await bcrypt.genSalt())

        
        return this.prismaService.users.update({
            data: updatePatchUserDto,
            where: {
                id
            }
        })
    }

    async delete(id: number) {
        await this.verifyIfIdExists(id)
        return this.prismaService.users.delete({
            where: {
                id
            }
        })
    }

    private async verifyIfIdExists(id: number) {
        const foundId = await this.prismaService.users.count({
            where: {
                id
            }
        })
        if(!(foundId)) {
            throw new NotFoundException('Id not found.')
        }
        

    }
}
