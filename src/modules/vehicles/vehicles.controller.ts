import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, SerializeOptions, UseInterceptors, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiBearerAuth, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { VehicleOneResponseDto } from './dto/vehicle-one-response.dto';
import { QueryVehicleDto } from './dto/query-vehicle.dto';
import { SortByObject } from '../../utils/sortBy';
import { VehicleQueryOrderDirection } from './vehicles.enums';
import { PagedVehicleResponseDto } from './dto/paged-vehicle-response.dto';

@ApiTags("vehicles")
@ApiBearerAuth()
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseInterceptors(ClassSerializerInterceptor)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    try {
      const vehicle = await this.vehiclesService.create(createVehicleDto);

      const response = new VehicleOneResponseDto();
      response.result = vehicle;
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findAll(@Query() query: QueryVehicleDto) {
    const limit: number = query.limit ?? 10;
    const page: number = query.page ?? 1;
    const skip = (page - 1) * limit;

    const orderBy = query.orderBy ?? -1;
    const sort: SortByObject = {};
    sort[orderBy] =
      query.orderDirection === VehicleQueryOrderDirection.DESC ? -1 : 1;

    const queryObject = {
      ...(query.brand && { brand: { $regex: query.brand, $options: "i" } }),
      ...(query.model && { model: { $regex: query.model, $options: "i" } }),
      ...(query.year && { year: query.year }),
      ...(query.color && { color: { $regex: query.color, $options: "i" } }),
      ...(query.type && { type: { $regex: query.type, $options: "i" } }),
      ...(query.status && { status: query.status })
    };

    const count = await this.vehiclesService.findAll(
      queryObject,
      undefined,
      undefined,
      null
    );

    const results = await this.vehiclesService.findAll(
      queryObject,
      limit,
      skip,
      sort
    );

    const result = new PagedVehicleResponseDto();
    result.count = count[1];
    result.page = page;
    result.limit = limit;
    result.result = results[0];

    return result;
  }

  @ApiParam({
    name: "id",
    description: "The vehicle's id",
    type: Number,
    example: 1
  })
  @Get(':id')
  @ApiNotFoundResponse({ description: "Vehicle not found" })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findOne(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findOne(+id);

    if (!vehicle) throw new BadRequestException("Vehicle not found");

    const response = new VehicleOneResponseDto();
    response.result = vehicle;
    return response;
  }
  @ApiParam({
    name: "id",
    description: "The vehicle's id",
    type: Number,
    example: 1
  })
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    try {
      const vehicle = await this.vehiclesService.update(+id, updateVehicleDto);

      const response = new VehicleOneResponseDto();
      response.result = vehicle;
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async remove(@Param('id') id: string) {
    await this.vehiclesService.remove(+id);

    return { message: "Vehicle deleted successfully" };
  }
}
