import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import {request} from "express";
import {JwtService} from "@nestjs/jwt";
import {Group} from "../group/group.entity";

@Injectable()
export class UsersService {
    private jwtService: JwtService;
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find({relations: ['groups']});
    }

    async findById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id }, relations: ['groups']});
    }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }

    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async update(id: number, user: User): Promise<User> {
        await this.userRepository.update(id, user);
        return this.userRepository.findOne({ where: { id }, relations: ['groups']});
    }

    async updateToken(id: number, token: string): Promise<User> {
        await this.userRepository.update(id, { token });
        return this.userRepository.findOne({ where: { id }, relations: ['groups']});
    }

    async getTokens(): Promise<User[]> {
        return this.userRepository.find({ select: ['token'] });
    }

    async getRoleByToken(token: string): Promise<User> {
        return this.userRepository.findOne({ where: { token }, select: ['role'] });
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async addGroup(id: number, group: Group): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['groups'] });
        user.groups.push(group);
        return this.userRepository.save(user);
    }
}
