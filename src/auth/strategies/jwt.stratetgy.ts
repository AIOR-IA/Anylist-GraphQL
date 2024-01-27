import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "../interfaces/jwt-payload";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
        configService:ConfigService,
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }


    async validate( payload: JwtPayload):Promise<User> {

        const { id } = payload;
        const user = await this.userRepository.findOneBy({ id });
        if( !user ) throw new UnauthorizedException('Token invalid');

        if( !user.isActive ) throw new UnauthorizedException('User is Inactive, talk with an admin');

        delete user.password;
        return user;
    }
}