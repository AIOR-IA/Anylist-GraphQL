import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const item = await this.itemRepository.create(createItemInput);
    await this.itemRepository.save( item );
    return item;
  }

  async findAll():Promise<Item[]> {
    return await this.itemRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id: id })
    if( !item ) throw new NotFoundException(`Item with id ${ id } not found`);

    return item;
  }

  async update( updateItemInput: UpdateItemInput): Promise<Item> {
    // preload busca por el item que esta dentro de updateItemInput
    const item = await this.itemRepository.preload( updateItemInput );

    if(!item) throw new NotFoundException(`Item with id ${ updateItemInput.id } not found`);

    return this.itemRepository.save( item );
  }

  async remove(id: string):Promise<Item> {
    const item = await this.findOne(id);
    this.itemRepository.delete(id);

    return item
  }
}
