import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ListService } from './list.service';
import { List } from './entities/list.entity';

import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { CreateListInput, UpdateListInput } from './dto';

@Resolver(() => List)
@UseGuards( JwtAuthGuard )
export class ListResolver {
  constructor(private readonly listService: ListService) {}

  @Mutation(() => List)
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user:User
  ) {
    return this.listService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'listAll' })
  findAll(
    @CurrentUser() user:User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs:SearchArgs
  ) {
    return this.listService.findAll( user, paginationArgs, searchArgs );
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user:User
  ) {
    return this.listService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user:User
  ) {
    return this.listService.update(updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user:User
  ) {
    return this.listService.remove(id, user);
  }
}
