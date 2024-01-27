import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { CreateListInput, UpdateListInput } from './dto';

@Injectable()
export class ListService {

  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>
  ) { }

  async create(createListInput: CreateListInput, user:User): Promise<List> {
    const list = await this.listsRepository.create({ ...createListInput, user})
    return await this.listsRepository.save(list) 
  }

  async findAll(user:User, paginationArgs:PaginationArgs, searchArgs: SearchArgs ):Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    
    const queryBuilder = this.listsRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where(`"userId" = :userId`, { userId: user.id });

    if ( search ) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${ search.toLowerCase() }%` });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listsRepository.findOneBy({ id: id, user: { id: user.id } })
    if( !list ) throw new NotFoundException(`List with id ${ id } not found`);
    // item.user = user;
    return list;
  }

  async update(updateListInput: UpdateListInput, user: User ): Promise<List> {
    
    await this.findOne( updateListInput.id, user );

    const list = await this.listsRepository.preload({ ...updateListInput, user });

    if ( !list ) throw new NotFoundException(`List with id: ${ updateListInput.id } not found`);

    return this.listsRepository.save( list );

  }

  async remove(id: string, user: User ): Promise<List> {
     
     const list = await this.findOne( id, user );
     await this.listsRepository.remove( list );
     return { ...list, id };
  }
}
