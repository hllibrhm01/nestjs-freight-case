import { Controller, Get, Post, Body, Patch, Param, Delete, SerializeOptions, UseInterceptors, ClassSerializerInterceptor, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ApiBearerAuth, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { SortByObject } from '../../utils/sortBy';
import { CityQueryOrderDirection } from './cities.enums';
import { QueryCityDto } from './dto/query-city.dto';
import { PagedCityResponseDto } from './dto/paged-city-response.dto';
import { CityOneResponseDto } from './dto/city-one-response.dto';

@ApiTags("cities")
@ApiBearerAuth()
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseInterceptors(ClassSerializerInterceptor)
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create(@Body() createCityDto: CreateCityDto) {
    try {
      const city = await this.citiesService.create(createCityDto);

      const response = new CityOneResponseDto();
      response.result = city;
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findAll(@Query() query: QueryCityDto) {
    const limit: number = query.limit ?? 10;
    const page: number = query.page ?? 1;
    const skip = (page - 1) * limit;

    const orderBy = query.orderBy ?? -1;
    const sort: SortByObject = {};
    sort[orderBy] =
      query.orderDirection === CityQueryOrderDirection.DESC ? -1 : 1;

    const queryObject = {
      ...(query.name && { name: query.name })
    };

    const count = await this.citiesService.findAll(
      queryObject,
      undefined,
      undefined,
      null
    );

    const results = await this.citiesService.findAll(
      queryObject,
      limit,
      skip,
      sort
    );

    const result = new PagedCityResponseDto();
    result.count = count[1];
    result.page = page;
    result.limit = limit;
    result.result = results[0];

    return result;
  }

  @ApiParam({
    name: "id",
    description: "The city's id",
    type: Number,
    example: 1
  })
  @Get(':id')
  @ApiNotFoundResponse({ description: "City not found" })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findOne(@Param('id') id: number) {
    const city = await this.citiesService.findOne(+id);

    if (!city) throw new BadRequestException("City not found");

    const response = new CityOneResponseDto();
    response.result = city;
    return response;
  }


  @ApiParam({
    name: "id",
    description: "The city's id",
    type: Number,
    example: 1
  })
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(@Param('id') id: number, @Body() updateCityDto: UpdateCityDto) {
    try {
      const city = await this.citiesService.update(+id, updateCityDto);
       
      const response = new CityOneResponseDto();
      response.result = city;
      return response; 
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async remove(@Param('id') id: number) {
    await this.citiesService.remove(+id);

    return { message: "City deleted successfully" };
  }
}
