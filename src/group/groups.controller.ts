import {Controller, Get, Post, Put, Delete, Param, Body, UnauthorizedException, Req} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group } from './group.entity';
import { RolesGuard } from '../role/roles.guard';
import { RolesRequired } from '../role/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../role/roles.enum';
import {AuthGuard} from "../auth/auth.guard";
import { UsersService } from '../user/users.service';
import {Request, request} from "express";
import {JwtService} from "@nestjs/jwt";

@UseGuards(AuthGuard, RolesGuard)
@Controller('api/groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService,
                private userService: UsersService,
                private jwtService: JwtService) {}

    @RolesRequired(Roles.Admin, Roles.Manager)
    @Get()
    async findAll(): Promise<Group[]> {
        return this.groupsService.findAll();
    }


    @RolesRequired(Roles.User, Roles.Admin, Roles.Manager)
    @Get(':id')
    async findById(@Param('id') id: number , @Req() request : Request): Promise<Group> {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        const decoded = this.jwtService.verify(token);
        const sub = decoded.sub;
        const user = await this.userService.findById(sub);

        if (user.role === Roles.User || user.role === Roles.Anonymous) {
            if (sub == id) {
                return this.groupsService.findById(id);
            }
            throw new UnauthorizedException('Unauthorized access to this group id');
        } else {
            return this.groupsService.findById(id);
        }
    }

    @RolesRequired(Roles.Admin, Roles.Manager)
    @Post()
    async create(@Body() group: Group): Promise<Group> {
        return this.groupsService.create(group);
    }

    @RolesRequired(Roles.Manager, Roles.Admin, Roles.User)
    @Put(':id')
    async update(@Param('id') id: number, @Body() group: Group): Promise<Group> {
        return this.groupsService.update(id, group);
    }

    @RolesRequired(Roles.Admin, Roles.Manager)
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        return this.groupsService.delete(id);
    }

    @RolesRequired(Roles.Admin, Roles.Manager)
    @Post(':id/users')
    async addUsers(@Param('id') id: number, @Body() user : Record<string, number>): Promise<Group> {
        console.log(user);
        const us = await this.userService.findById(user.id);
        const group = await this.groupsService.findById(id);
        console.log(us);
        await this.userService.addGroup(user.id, group);
        return this.groupsService.addUsers(id, us);
    }
}
