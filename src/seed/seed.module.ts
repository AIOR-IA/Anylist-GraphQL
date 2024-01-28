import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from 'src/items/items.module';
import { UsersModule } from 'src/users/users.module';
import { ListItemModule } from 'src/list-item/list-item.module';
import { ListModule } from 'src/list/list.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,
    ItemsModule,
    UsersModule,
    ListItemModule,
    ListModule
  ]
})
export class SeedModule {}
