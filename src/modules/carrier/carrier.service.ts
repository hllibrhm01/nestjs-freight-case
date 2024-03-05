import { Body, Injectable, Param } from '@nestjs/common';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { CommonService } from '../common/common.service';
import { Carrier } from './entities/carrier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { DistrictsService } from '../districts/districts.service';
import { UsersService } from '../users/users.service';
import { RoleEnum } from '../roles/roles.enum';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CarrierQueryOrderBy, CarrierQueryOrderDirection } from './carrier.enums';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CarrierService extends CommonService<Carrier> {
  constructor(
    @InjectRepository(Carrier)
    private readonly carrierRepository: Repository<Carrier>,
    private readonly districtsService: DistrictsService,
    private readonly usersService: UsersService,
    private readonly vehiclesService: VehiclesService
  ) {
    super(carrierRepository);
  }

  async create(createCarrierDto: CreateCarrierDto) {
    const carrier = this.carrierRepository.create(createCarrierDto);

    const existingCarrier = await this.carrierRepository.findOne({
      where: { userId: createCarrierDto.userId }
    });

    const existingUser = await this.usersService.findOne(createCarrierDto.userId);

    if (existingUser?.role !== RoleEnum.CARRIER) throw new Error('User is not a carrier');

    const existingVehicle = await this.vehiclesService.findOne(createCarrierDto.vehicleId);

    if (existingVehicle === null) 
      throw new Error('Vehicle not found');


    if (existingUser === null) 
      throw new Error('User not found');

    if (existingCarrier !== null) 
      throw new Error('Carrier with this user already exists');

    await this.districtsService.checkMatchWithCity(createCarrierDto.districtId, createCarrierDto.cityId);

    return this.carrierRepository.save(carrier);
  }

  async update(
    @Param('id') id: number,
    @Body() updateCarrierDto: UpdateCarrierDto,
    user: User
  ) {
    const carrier = await this.carrierRepository.findOne({ where: { id } });

    if (user.role !== RoleEnum.ADMIN && carrier?.userId !== user.id)
      throw new Error('You are not authorized to update this carrier');

    if (!carrier) throw new Error('Carrier not found');

    if (updateCarrierDto.userId) {
      const existingUser = await this.usersService.findOne(updateCarrierDto.userId);

      if (existingUser === null) 
        throw new Error('User not found');

      const existingCarrier = await this.carrierRepository.findOne({
        where: { userId: updateCarrierDto.userId }
      });

      if (existingCarrier !== null) 
        throw new Error('Carrier with this user already exists');

      carrier.userId = updateCarrierDto.userId;
    }

    if (updateCarrierDto.vehicleId) {
      const existingVehicle = await this.vehiclesService.findOne(updateCarrierDto.vehicleId);

      if (existingVehicle === null) 
        throw new Error('Vehicle not found');

      const existingCarrier = await this.carrierRepository.findOne({
        where: { vehicleId: updateCarrierDto.vehicleId }
      });

      if (existingCarrier !== null) 
        throw new Error('Carrier with this vehicle already exists');
      
      carrier.vehicleId = updateCarrierDto.vehicleId;
    }

    if (updateCarrierDto.companyName) carrier.companyName = updateCarrierDto.companyName;

    if (updateCarrierDto.phoneNumber) carrier.phoneNumber = updateCarrierDto.phoneNumber;

    if (updateCarrierDto.vehiclePlateNumber) carrier.vehiclePlateNumber = updateCarrierDto.vehiclePlateNumber;

    if (updateCarrierDto.discountRate) carrier.discountRate = updateCarrierDto.discountRate;

    if (updateCarrierDto.promotionalOffers) carrier.promotionalOffers = updateCarrierDto.promotionalOffers;

    if (updateCarrierDto.cityId) {
      await this.districtsService.checkMatchWithCity(carrier.districtId, updateCarrierDto.cityId);

      carrier.cityId = updateCarrierDto.cityId;
    }

    if (updateCarrierDto.districtId) {
      await this.districtsService.checkMatchWithCity(updateCarrierDto.districtId, carrier.cityId);

      carrier.districtId = updateCarrierDto.districtId;
    }

    return await this.carrierRepository.save(carrier);
  }

  async findOneWithJoin(id: number): Promise<Carrier> {
    const carrier = await this.carrierRepository.findOne({
      where: { id },
      relations: ["city", "district", "user", "vehicle"]
    });

    if (!carrier) throw new Error('Carrier not found');

    return carrier;
  }

  async getCarriersWithJoin(
    cityId: number | undefined,
    districtId: number | undefined,
    userId: number | undefined,
    vehicleId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    orderBy: CarrierQueryOrderBy | undefined,
    orderDirection: CarrierQueryOrderDirection,
    count: true
  ): Promise<number>;
  async getCarriersWithJoin(
    cityId: number | undefined,
    districtId: number | undefined,
    userId: number | undefined,
    vehicleId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    orderBy: CarrierQueryOrderBy | undefined,
    orderDirection: CarrierQueryOrderDirection,
    count: false
  ): Promise<Carrier[]>;
  async getCarriersWithJoin(
    cityId: number | undefined,
    districtId: number | undefined,
    userId: number | undefined,
    vehicleId: number | undefined,
    limit: number | undefined = 10,
    skip: number | undefined = 0,
    orderBy: CarrierQueryOrderBy | undefined,
    orderDirection: CarrierQueryOrderDirection | undefined,
    count: boolean = false
  ): Promise<Carrier[] | number> {
    const queryBuilder: SelectQueryBuilder<Carrier> =
      this.carrierRepository.createQueryBuilder("carrier");

    const query = queryBuilder
      .innerJoinAndSelect("carrier.city", "city")
      .innerJoinAndSelect("carrier.district", "district")
      .innerJoinAndSelect("carrier.user", "user")
      .innerJoinAndSelect("carrier.vehicle", "vehicle");
      

    if (cityId !== undefined) query.where("carrier.cityId = :id", { id: cityId });

    if (districtId !== undefined) query.where("carrier.districtId = :id", { id: districtId });

    if (userId !== undefined) query.where("carrier.userId = :id", { id: userId });

    if (vehicleId !== undefined) query.where("carrier.vehicleId = :id", { id: vehicleId });

    if (count) return query.getCount();

    return query
      .orderBy(`district.${orderBy}`, orderDirection)
      .skip(skip)
      .take(limit)
      .getMany();
  }
}
