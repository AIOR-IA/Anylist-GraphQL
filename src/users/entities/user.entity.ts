import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'users'})
@ObjectType()
export class User {
  @Field(() => ID, { description: 'Uuid user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text',{ unique: true})
  @Field( () => String)
  email:string;

  @Column('text')
  //no queremos usar esto en graphql
  // @Field( () => String)
  password: string;

  @Column('text')
  @Field( () => String)
  fullName:string;

  @Column('boolean', { default: true})
  @Field( () => Boolean)
  isActive: boolean;

  @Column({
    type: 'text',
    array: true,
    default:['user']
  })
  @Field( () => [String])
  roles: string[];

  //TODO: relations 
  @ManyToOne( () => User, ( user) => user.lastUpdateBy, { nullable: true, lazy: true},)
  @JoinColumn({ name: 'lastUpdateBy'})
  @Field( () => User, { nullable: true })
  lastUpdateBy?:User;

  @OneToMany( () => Item , (item) => item.user, { lazy: true})
  // @Field( () => [Item])
  items: Item[]
}
