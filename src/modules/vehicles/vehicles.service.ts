import { Body, Injectable, Param } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';

@Injectable()
export class VehiclesService extends CommonService<Vehicle> {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>
  ) {
    super(vehicleRepository);
  }
  async create(createVehicleDto: CreateVehicleDto) {
    const vehicle = this.vehicleRepository.create(createVehicleDto);

    const existingVehicle = await this.vehicleRepository.findOne({
      where: { brand: createVehicleDto.brand, model: createVehicleDto.model }
    });

    if (existingVehicle && existingVehicle.year === createVehicleDto.year)
      throw new Error('Vehicle with this brand, model and year already exists');

    return this.vehicleRepository.save(vehicle);
  }

  async update(@Param() id: number, @Body() updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) throw new Error('Vehicle not found');

    if (updateVehicleDto.brand) vehicle.brand = updateVehicleDto.brand;
    if (updateVehicleDto.model) vehicle.model = updateVehicleDto.model;
    if (updateVehicleDto.year) vehicle.year = updateVehicleDto.year;
    if (updateVehicleDto.color) vehicle.color = updateVehicleDto.color;
    if (updateVehicleDto.type) vehicle.type = updateVehicleDto.type;
    if (updateVehicleDto.status) vehicle.status = updateVehicleDto.status;

    return await this.vehicleRepository.save(vehicle);
  }
}
