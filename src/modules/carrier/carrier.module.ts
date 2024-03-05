import { Module } from '@nestjs/common';
import { CarrierService } from './carrier.service';
import { CarrierController } from './carrier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrier } from './entities/carrier.entity';
import { ConfigModule } from '@nestjs/config';
import { DistrictsModule } from '../districts/districts.module';
import { UsersModule } from '../users/users.module';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrier]),  
    ConfigModule,
    UsersModule,
    VehiclesModule,
    DistrictsModule
  ],
  controllers: [CarrierController],
  providers: [CarrierService],
  exports: [CarrierService]
})
export class CarrierModule {}
