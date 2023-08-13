import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Roles } from '../role/roles.enum';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupName: string;

    @ManyToMany(() => User, (user) => user.groups)
    @JoinTable()
    users: User[];

}
