import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Group } from '../group/group.entity';
import { Roles } from "../role/roles.enum";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( { nullable: true })
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({select: false})
    password: string;

    @Column({ default: 'user' })
    role: Roles;

    @Column({ nullable: true, select: false})
    token: string;

    @ManyToMany(() => Group, { cascade: true })
    @JoinTable()
    groups: Group[];
}
