import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lists'})
@ObjectType()
export class List {
  @Field(() => ID, { description: 'id list' })
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Field(() => String, { description: 'name list' })
  @IsString()
  @IsNotEmpty()
  @Column('text')
  name: string;

  @ManyToOne( () => User, (user) => user.lists, { nullable: false , lazy: true} )
  @Index('userId-list-index')
  @Field( () => User)
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  // @Field( () => [ListItem] )
  listItem: ListItem[]
}
