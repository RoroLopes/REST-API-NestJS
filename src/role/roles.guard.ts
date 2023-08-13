import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.enum';
import { UsersService } from "../user/users.service";
import {Query} from "typeorm/driver/Query";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private usersService: UsersService) {}

    matchRoles(Requiredroles: Roles[], userRoles: Roles): boolean {
        return Requiredroles.some((role) => role === userRoles)
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<Roles[]>('roles', context.getHandler());

        console.log(requiredRoles);

        if (!requiredRoles) {
            return true;
        }


        const request = context.switchToHttp().getRequest();
        const user = await this.usersService.findById(request.user.sub);
        console.log(user.role);
        if (!this.matchRoles(requiredRoles, user.role)) {
            throw new UnauthorizedException('You do not have permission (Roles)');
        }
        else {
            return true;
        }

    }
}
