import { Injectable } from '@nestjs/common';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './dto/inputs/types/auth-response.type';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService
    ) {}

    async signUp( signupInput: SignupInput): Promise<AuthResponse> {

       const newUser = await this.userService.create(signupInput);

       return {
        token:'abc',
        user: newUser
       }
    }
}
