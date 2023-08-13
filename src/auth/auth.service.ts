import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
                private jwtService: JwtService) {}

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user.password !== pass) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        const payload = { sub: user.id, email: user.email };
        await this.usersService.updateToken(user.id, await this.jwtService.signAsync(payload));
        return {
            ...result,
        };
    };

    async findUserById(id: number): Promise<any> {
        const user = await this.usersService.findById(id);
        return {
            user,
        };
    }
}