import { Controller, Get, Post, Body, Patch, Param, Delete, SerializeOptions, UseInterceptors, ClassSerializerInterceptor, BadRequestException, UseGuards, Query, UseFilters } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { ApiBearerAuth, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { DistrictOneResponseDto } from './dto/district-one-response.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { QueryDistrictDto } from './dto/query-district.dto';
import { DistrictQueryOrderBy, DistrictQueryOrderDirection } from './districts.enums';
import { PagedDistrictResponseDto } from './dto/paged-district-response.dto';
import { PagedCityResponseDto } from '../cities/dto/paged-city-response.dto';
import { DistrictResponseDto } from './dto/district.response.dto';
import { CityOneResponseDto } from '../cities/dto/city-one-response.dto';
import { AllExceptionsFilter } from 'src/utils/postgre-exception.filters';

@ApiTags("districts")
@ApiBearerAuth()
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(AllExceptionsFilter)
@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create(@Body() createDistrictDto: CreateDistrictDto) {
    try {
      const district = await this.districtsService.create(createDistrictDto);

      const response = new DistrictOneResponseDto();
      response.result = new DistrictResponseDto();
      response.result.name = district.name;
      response.result.cityId = district.cityId;
      response.result.city = new CityOneResponseDto();
      response.result.city.result = district.city;
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findAll(
    @Query() query: QueryDistrictDto
  ): Promise<PagedCityResponseDto> {
    try {
      const limit = query.limit ?? 10;
      const page = query.page ?? 1;
      const skip = (page - 1) * limit;

      const queryOrderBy =
        query.orderBy === undefined
          ? DistrictQueryOrderBy.CREATED
          : query.orderBy;
      const queryOrderDirection =
        query.orderDirection === undefined
          ? DistrictQueryOrderDirection.DESC
          : query.orderDirection;

      const count = await this.districtsService.getDistrictsWithJoin(
        query.cityId,
        limit,
        skip,
        queryOrderBy,
        queryOrderDirection,
        true
      );

      const results = await this.districtsService.getDistrictsWithJoin(
        query.cityId,
        limit,
        skip,
        queryOrderBy,
        queryOrderDirection,
        false
      );

      const result = new PagedDistrictResponseDto();
      result.count = count;
      result.page = page;
      result.limit = limit;
      result.result = results.map((district) => {
        const response = new DistrictResponseDto();
        response.name = district.name;

        response.city = new CityOneResponseDto();
        response.city.result = district.city;

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
    description: "The district's id",
    example: 1
  })
  @Get(':id')
  @ApiNotFoundResponse({ description: "District not found" })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findOne(@Param('id') id: number) {  
    const district = await this.districtsService.findOneWithJoin(id);
    
    if (!district) throw new BadRequestException("District not found");

    const response = new DistrictOneResponseDto();
    response.result = new DistrictResponseDto();
    response.result.name = district.name;
    response.result.cityId = district.cityId;
    response.result.city = new CityOneResponseDto();
    response.result.city.result = district.city;
    return response;
  }

  @ApiParam({
    name: "id",
    description: "The district's id",
    type: Number,
    example: 1
  })
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(@Param('id') id: number, @Body() updateDistrictDto: UpdateDistrictDto) {
    try {
      const district = await this.districtsService.update(id, updateDistrictDto);

      const response = new DistrictOneResponseDto();  
      response.result = new DistrictResponseDto();
      response.result.name = district.name;
      response.result.cityId = district.cityId;
      response.result.city = new CityOneResponseDto();
      response.result.city.result = district.city;
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async remove(@Param('id') id: number) {
    await this.districtsService.remove(+id);

    return {
      message: "District deleted successfully"
    };
  }
}
