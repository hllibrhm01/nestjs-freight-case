import { Module } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([District]),
    ConfigModule,
    CitiesModule
  ],
  controllers: [DistrictsController],
  providers: [DistrictsService],
  exports: [DistrictsService]
})
export class DistrictsModule {}
