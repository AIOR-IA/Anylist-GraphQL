import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './dto/types/auth-response.type';
import { LoginInput, SignupInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    private getJwtToken( userId: string ) {
        return this.jwtService.sign({ id: userId });
    }

    async signUp( signupInput: SignupInput): Promise<AuthResponse> {

       const user = await this.userService.create(signupInput);

       const token = this.getJwtToken( user.id );

       return {
        token: token,
        user: user
       }
    }

    async login(loginInput:LoginInput): Promise<AuthResponse> {
        const { email, password } = loginInput;
        const user = await this.userService.findOneByEmail(email);
        if( !bcrypt.compareSync(password, user.password) )
            throw new BadRequestException(`Email / Password do not match`);

        const token = this.getJwtToken( user.id );

        return {
            token: token,
            user: user
        }
    }

    revalidateToken( user: User ): AuthResponse {

        const token = this.getJwtToken( user.id );

        return { token, user }

    }
}
