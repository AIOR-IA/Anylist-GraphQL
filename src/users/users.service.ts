import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import e from 'express';
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

  async findAll():Promise<User []> {
    return [];
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

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string):Promise<User> {
    throw new Error('block method not implemented');

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
