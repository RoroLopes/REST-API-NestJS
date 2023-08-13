import { Controller, Get, Post, Put, Delete, Param, Body, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { RolesGuard } from '../role/roles.guard';
import { RolesRequired } from '../role/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../role/roles.enum';
import { AuthGuard} from "../auth/auth.guard";
import {Query} from "typeorm/driver/Query";
import {Request, request} from "express";
import {JwtService} from "@nestjs/jwt";
import {ExecutionContextHost} from "@nestjs/core/helpers/execution-context-host";

@Controller('api/users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService,) {}



    @RolesRequired(Roles.Admin, Roles.Manager)
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @RolesRequired(Roles.User, Roles.Anonymous, Roles.Admin, Roles.Manager)
    @Get(':id')
    async findOwnId(@Param('id') id: number, @Req() request: Request): Promise<User> {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        const decoded = this.jwtService.verify(token);
        const sub = decoded.sub;
        const user = await this.usersService.findById(sub);

        if (user.role === Roles.User || user.role === Roles.Anonymous) {
            if (sub == id) {
                return this.usersService.findById(id);
            }

            throw new UnauthorizedException('Unauthorized access to this user id');
        } else {
            return this.usersService.findById(id);
        }
    }

    @RolesRequired(Roles.Admin, Roles.Manager)
    @Post()
    async create(@Body() user: User): Promise<User> {
        return this.usersService.create(user);
    }

    @RolesRequired(Roles.Manager, Roles.Admin, Roles.User)
    @Put(':id')
    async update(@Param('id') id: number, @Body() user: User, @Req() request : Request): Promise<User> {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        const decoded = this.jwtService.verify(token);
        const sub = decoded.sub;
        const us = await this.usersService.findById(sub);
        if (us.role === Roles.User) {
            if (sub == id) {
                return this.usersService.update(id, user);
            }
            throw new UnauthorizedException('Unauthorized access to this user id');
        } else
            return this.usersService.update(id, user);
    }

    @RolesRequired(Roles.Admin)
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        return this.usersService.delete(id);
    }
}
