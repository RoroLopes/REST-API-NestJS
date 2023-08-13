import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import {User} from "../user/user.entity";

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
    ) {}

    async findAll(): Promise<Group[]> {
        return this.groupRepository.find();
    }

    async findById(id: number): Promise<Group> {
        return this.groupRepository.findOne({ where: { id }, relations: ['users'] });
    }

    async create(group: Group): Promise<Group> {
        return this.groupRepository.save(group);
    }

    async update(id: number, group: Group): Promise<Group> {
        await this.groupRepository.update(id, group);
        return this.groupRepository.findOne({ where: { id }, relations: ['User'] });
    }

    async delete(id: number): Promise<void> {
        await this.groupRepository.delete(id);
    }

    async addUsers(id: number, user : User): Promise<Group> {
        const group = await this.groupRepository.findOne({ where: { id }, relations: ['users'] });
        group.users.push(user);
        return this.groupRepository.save(group);
    }
}
