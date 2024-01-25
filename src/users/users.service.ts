import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = await this.userRepository.create(signupInput);
      
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Something is bad')
    }
  }

  async findAll():Promise<User []> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error('findOne method not implemented');
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string):Promise<User> {
    throw new Error('block method not implemented');

  }
}
