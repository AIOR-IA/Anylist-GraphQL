import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { SearchArgs, PaginationArgs } from 'src/common/dto/args';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {}

  async create(createItemInput: CreateItemInput, user:User): Promise<Item> {
    const item = await this.itemRepository.create(createItemInput);
    item.user = user;
    await this.itemRepository.save( item );
    return item;
  }

  async findAll(user:User, paginationArgs:PaginationArgs, searchArgs: SearchArgs ):Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    
    const queryBuilder = this.itemRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where(`"userId" = :userId`, { userId: user.id });

    if ( search ) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${ search.toLowerCase() }%` });
    }

    return queryBuilder.getMany();
    // return await this.itemRepository.find({ 
    //   take: limit, 
    //   skip: offset,
    //   where: { 
    //     user: user ,
    //     name: Like(`%${search?.toLocaleLowerCase()}%`)
    //   }, 
    // }
     
    // );
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id: id, user: { id: user.id } })
    if( !item ) throw new NotFoundException(`Item with id ${ id } not found`);
    // item.user = user;
    return item;
  }

  async update( updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOne( updateItemInput.id, user);

    // preload busca por el item que esta dentro de updateItemInput
    const item = await this.itemRepository.preload( updateItemInput );
    if(!item) throw new NotFoundException(`Item with id ${ updateItemInput.id } not found`);

    return this.itemRepository.save( item );
  }

  async remove(id: string, user:User):Promise<Item> {
    const item = await this.findOne(id, user);
    this.itemRepository.delete(id);

    return item
  }

  async itemsCountByUser(user: User):Promise<number> {
    return this.itemRepository.count({ 
      where: {
        user: {
          id: user.id
        }
      }
    })
  }
}
