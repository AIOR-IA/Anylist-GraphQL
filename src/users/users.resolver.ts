import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { use } from 'passport';
import { ItemsService } from 'src/items/items.service';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { Item } from 'src/items/entities/item.entity';

@Resolver(() => User)
@UseGuards(  JwtAuthGuard )
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService

    ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: SignupInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user:User,
    @Args() validRoles: ValidRolesArgs
  ):Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user:User,
    @Args('id', { type: () => ID } , ParseUUIDPipe ) id: string
    ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user:User
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.user]) user: User
  ):Promise<User> {
    return this.usersService.block( id, user);
  }

  @ResolveField( () => Int ,{ name: 'itemsCount'})
  async itemCount(
    @Parent() user:User,
    @CurrentUser([ValidRoles.admin]) adminUser: User
  ):Promise<number>{
    return this.itemsService.itemsCountByUser(user);
  }

  @ResolveField( () => [Item] ,{ name: 'items'})
  async getItemsByUser(
    @Parent() user:User,
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ):Promise<Item[]>{
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }
}
