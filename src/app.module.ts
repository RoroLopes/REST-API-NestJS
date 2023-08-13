import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user/user.entity';
import { Group } from './group/group.entity';
import { UsersService } from './user/users.service';
import { GroupsService } from './group/groups.service';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './user/users.controller';
import { GroupsController } from './group/groups.controller';
import { RolesGuard } from './role/roles.guard';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import * as process from "process";

@Module({
    imports: [
        ConfigModule.forRoot(), // Initialize ConfigModule
        TypeOrmModule.forRootAsync({
            imports: undefined,
            useFactory: () => ({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT, 10),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [User, Group],
                synchronize: true,
            })
        }),
        TypeOrmModule.forFeature([User, Group]),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '8000000000s' },
        }),
    ],
    controllers: [AuthController, UsersController, GroupsController],
    providers: [UsersService, GroupsService, AuthService],
})
export class AppModule {}