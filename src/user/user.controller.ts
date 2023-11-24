import { Controller, Post, Body, Get, Param, Put, Patch, Delete, ParseIntPipe, UseInterceptors, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put.dto";
import { UpdatePatchUserDTO } from './dto/update-patch.dto'
import { UserService } from "./user.service";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/role.decorator";
import { Role } from "src/enums/roles.enum";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService){}

    @Roles(Role.Admin)
    @Post()
    async create(@Body() createUserDto: CreateUserDTO) {
        return this.userService.create(createUserDto)
    }

    @Roles(Role.Admin, Role.User)
    @Get()
    async read() {
        return this.userService.list()
    }

    @Get(':id')
    async readOne(@ParamId('id', ParseIntPipe) id: number) {
        return this.userService.show(id)
    }

    @Roles(Role.Admin)
    @Put(':id')
    async update(@Body() updatePutUserDto: UpdatePutUserDTO, @ParamId() id: number){
        return this.userService.update(id, updatePutUserDto)
    }

    @Roles(Role.Admin)
    @Patch(':id')
    async updatePartial(@Body() updatePatchUserDto: UpdatePatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(id, updatePatchUserDto)
    }

    @Roles(Role.Admin)
    @Delete(':id')
    async delete(@ParamId() id: number) {
        return this.userService.delete(id)
    }
}