import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, SerializeOptions, UseInterceptors, BadRequestException, UseGuards, Query, UseFilters } from '@nestjs/common';
import { CarrierService } from './carrier.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { ApiBearerAuth, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CarrierOneResponseDto } from './dto/carrier-one-response.dto';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { QueryCarrierDto } from './dto/query-carrier.dto';
import { PagedCarrierResponseDto } from './dto/paged-carrier-response.dto';
import { CarrierQueryOrderBy, CarrierQueryOrderDirection } from './carrier.enums';
import { CarrierResponseDto } from './dto/carrier.response.dto';
import { CityOneResponseDto } from '../cities/dto/city-one-response.dto';
import { DistrictOneResponseDto } from '../districts/dto/district-one-response.dto';
import { VehicleOneResponseDto } from '../vehicles/dto/vehicle-one-response.dto';
import { UserOneResponseDto } from '../users/dto/user-one-response.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AllExceptionsFilter } from '../../utils/postgre-exception.filters';

@ApiTags("carrier")
@ApiBearerAuth()
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseInterceptors(ClassSerializerInterceptor)
@Controller('carrier')
@UseFilters(AllExceptionsFilter)
export class CarrierController {
  constructor(private readonly carrierService: CarrierService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create(@Body() createCarrierDto: CreateCarrierDto) {
    try {
      await this.carrierService.create(createCarrierDto);

      return {
        message: 'Carrier created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll(
    @Query() query: QueryCarrierDto
  ): Promise<PagedCarrierResponseDto> {
    try {
      const limit = query.limit ?? 10;
      const page = query.page ?? 1;
      const skip = (page - 1) * limit;

      const queryOrderBy =
      query.orderBy === undefined
        ? CarrierQueryOrderBy.CREATED
        : query.orderBy;
      const queryOrderDirection =
      query.orderDirection === undefined
        ? CarrierQueryOrderDirection.DESC
        : query.orderDirection;

      const count = await this.carrierService.getCarriersWithJoin(
        query.cityId,
        query.districtId,
        query.userId,
        query.vehicleId,
        limit,
        skip,
        queryOrderBy,
        queryOrderDirection,
        true
      );

      const results = await this.carrierService.getCarriersWithJoin(
        query.cityId,
        query.districtId,
        query.userId,
        query.vehicleId,
        limit,
        skip,
        queryOrderBy,
        queryOrderDirection,
        false
      );

      const result = new PagedCarrierResponseDto();
      result.count = count;
      result.page = page;
      result.limit = limit;
      result.result = results.map((carrier) => {
        const response = new CarrierResponseDto();
        response.companyName = carrier.companyName;
        response.phoneNumber = carrier.phoneNumber;
        response.vehiclePlateNumber = carrier.vehiclePlateNumber;
        response.discountRate = carrier.discountRate;
        response.promotionalOffers = carrier.promotionalOffers;

        response.city = new CityOneResponseDto();
        response.city.result = carrier.city;

        response.district = new DistrictOneResponseDto();
        // @ts-expect-error
        response.district.result = carrier.district;

        response.vehicle = new VehicleOneResponseDto();
        response.vehicle.result = carrier.vehicle;

        response.user = new UserOneResponseDto();
        response.user.result = carrier.user;

        return response;
      }); 
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiParam({
    name: "id",
    type: Number,
    description: "The carrier's id",
    example: 1
  })
  @Get(':id')
  @ApiNotFoundResponse({ description: "Carrier not found" })
  async findOne(@Param('id') id: number) {
    const carrier = await this.carrierService.findOneWithJoin(id);

    if (!carrier) throw new BadRequestException("Carrier not found");

    const response = new CarrierOneResponseDto();
    response.result = new CarrierResponseDto();
    response.result.companyName = carrier.companyName;
    response.result.phoneNumber = carrier.phoneNumber;
    response.result.vehiclePlateNumber = carrier.vehiclePlateNumber;
    response.result.discountRate = carrier.discountRate;
    response.result.promotionalOffers = carrier.promotionalOffers;
    response.result.city = new CityOneResponseDto();
    response.result.city.result = carrier.city;
    response.result.district = new DistrictOneResponseDto();
    // @ts-expect-error
    response.result.district.result = carrier.district;
    response.result.vehicle = new VehicleOneResponseDto();
    response.result.vehicle.result = carrier.vehicle;

    response.result.user = new UserOneResponseDto();
    response.result.user.result = carrier.user;

    return response;
  }

  @ApiParam({
    name: "id",
    type: Number,
    description: "The carrier's id",
    example: 1
  })
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(
    @Param('id') id: number, 
    @Body() updateCarrierDto: UpdateCarrierDto,
    @CurrentUser() user: User  
  ) {
    try {
      const carrier = await this.carrierService.update(id, updateCarrierDto, user);

      const response = new CarrierOneResponseDto();
      response.result = new CarrierResponseDto();
      response.result.companyName = carrier.companyName;
      response.result.phoneNumber = carrier.phoneNumber;
      response.result.vehiclePlateNumber = carrier.vehiclePlateNumber;
      response.result.discountRate = carrier.discountRate;
      response.result.promotionalOffers = carrier.promotionalOffers;
      response.result.city = new CityOneResponseDto();
      response.result.city.result = carrier.city;
      response.result.district = new DistrictOneResponseDto();
      // @ts-expect-error
      response.result.district.result = carrier.district;
      response.result.vehicle = new VehicleOneResponseDto();
      response.result.vehicle.result = carrier.vehicle;
      response.result.user = new UserOneResponseDto();
      response.result.user.result = carrier.user;

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.carrierService.remove(+id);

    return {
      message: 'Carrier deleted successfully',
    };
  }
}
