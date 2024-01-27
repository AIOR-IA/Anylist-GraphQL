import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import e from 'express';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
@Injectable()
export class UsersService {

  private logger = new Logger('UsersService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
       
      const newUser = await this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10 )
      });
      
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]):Promise<User []> {
    if( roles.length === 0 ) {
      return await this.userRepository.find({
        relations: {
          lastUpdateBy: true
        }
      });
    }
    return this.userRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles) 
      .getMany();

  }

  async findOneByEmail(email: string): Promise<User> {
    try {

      const user = await this.userRepository.findOneByOrFail({ email: email })
      if( !user ) throw new NotFoundException(`User with email ${ email } not found.`);

      return user;

    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `${email} not found`
      });
    }
  }

  async findOneById( id: string ): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${ id } not found`);
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput, user:User): Promise<User> {
    try {
      const userDB = await this.userRepository.preload({ 
        ...updateUserInput, 
        id
      })

      userDB.lastUpdateBy = user;
      return await this.userRepository.save(userDB);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, user: User):Promise<User> {
    const userDB = await this.findOneById( id );
    userDB.isActive = (userDB.isActive) ? user.isActive = false : userDB.isActive = true;
    userDB.lastUpdateBy = user;
    return await this.userRepository.save(userDB);

  }



  private handleDBErrors( error: any ): never{
    
    if( error.code === '23505' ){
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    if( error.code == 'error-001' ){
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    this.logger.error( error );
    
    throw new InternalServerErrorException('Please check server logs');
  }
}
