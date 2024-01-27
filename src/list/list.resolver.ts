import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListService } from './list.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';

@Resolver(() => List)
export class ListResolver {
  constructor(private readonly listService: ListService) {}

  @Mutation(() => List)
  createList(@Args('createListInput') createListInput: CreateListInput) {
    return this.listService.create(createListInput);
  }

  @Query(() => [List], { name: 'list' })
  findAll() {
    return this.listService.findAll();
  }

  @Query(() => List, { name: 'list' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.listService.findOne(id);
  }

  @Mutation(() => List)
  updateList(@Args('updateListInput') updateListInput: UpdateListInput) {
    return this.listService.update(updateListInput.id, updateListInput);
  }

  @Mutation(() => List)
  removeList(@Args('id', { type: () => Int }) id: number) {
    return this.listService.remove(id);
  }
}
