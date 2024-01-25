import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
