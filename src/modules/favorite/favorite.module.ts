import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]), 
    ConfigModule,
    UsersModule
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService]
})
export class FavoriteModule {}
