import { Controller, Get, Post, Body, Patch, Param, Delete, SerializeOptions, ClassSerializerInterceptor, UseInterceptors, UseGuards, BadRequestException, Query, UseFilters } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { ApiBearerAuth, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { FavoriteOneResponseDto } from './dto/favorite-one-response.dto';
import { QueryFavoriteDto } from './dto/query-favorite.dto';
import { SortByObject } from '../../utils/sortBy';
import { FavoriteQueryOrderBy, FavoriteQueryOrderDirection } from './favorite.enums';
import { PagedFavoriteResponseDto } from './dto/paged-favorite-response.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserOneResponseDto } from '../users/dto/user-one-response.dto';
import { CarrierOneResponseDto } from '../carrier/dto/carrier-one-response.dto';
import { CityOneResponseDto } from '../cities/dto/city-one-response.dto';
import { DistrictOneResponseDto } from '../districts/dto/district-one-response.dto';
import { VehicleOneResponseDto } from '../vehicles/dto/vehicle-one-response.dto';
import { FavoriteResponseDto } from './dto/favorite.response.dto';
import { InternalServerErrorFilter } from '../../utils/internal-server.filter';
import { AllExceptionsFilter } from '../../utils/postgre-exception.filters';

@ApiTags("favorites")
@ApiBearerAuth()
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseInterceptors(ClassSerializerInterceptor)
@Controller('favorite')
@UseFilters(AllExceptionsFilter)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  async create(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @CurrentUser() user: User
  ) {
    try {
      const favorite = await this.favoriteService.create(createFavoriteDto, user);

      const response = new FavoriteOneResponseDto();  
      response.result.user = new UserOneResponseDto();
      response.result.user.result = favorite.user;
      response.result.carrier = new CarrierOneResponseDto();
      response.result.carrier.result.city = new CityOneResponseDto();
      response.result.carrier.result.city.result = favorite.carrier.city;
      response.result.carrier.result.district = new DistrictOneResponseDto();
      // @ts-expect-error
      response.result.carrier.result.district.result = favorite.carrier.district;
      response.result.carrier.result.user = new UserOneResponseDto();
      response.result.carrier.result.user.result = favorite.carrier.user;
      response.result.carrier.result.vehicle = new VehicleOneResponseDto();
      response.result.carrier.result.vehicle.result = favorite.carrier.vehicle;

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  async findAll(
    @Query() query: QueryFavoriteDto,
    @CurrentUser() user: User
  ) {
    let userId: number = 0;

    if (user.role !== RoleEnum.ADMIN) {
      userId = user.id;
    }
  
    const limit: number = query.limit ?? 10;
    const page: number = query.page ?? 1;
    const skip = (page - 1) * limit;

    const queryOrderBy =
    query.orderBy === undefined
      ? FavoriteQueryOrderBy.CREATED
      : query.orderBy;
    const queryOrderDirection =
    query.orderDirection === undefined
      ? FavoriteQueryOrderDirection.DESC
      : query.orderDirection;

    const count = await this.favoriteService.getFavoritesWithJoin(
      userId,
      query.carrierId,
      limit,
      skip,
      queryOrderBy,
      queryOrderDirection,
      true
    );

    const results = await this.favoriteService.getFavoritesWithJoin(
      userId,
      query.carrierId,
      limit,
      skip,
      queryOrderBy,
      queryOrderDirection,
      false
    );
    
    const result = new PagedFavoriteResponseDto();
    result.count = count;
    result.page = page;
    result.limit = limit;
    result.result = results.map((favorite) => {
      const response = new FavoriteResponseDto();
      response.user = new UserOneResponseDto();
      response.user.result = favorite.user;
      response.carrier = new CarrierOneResponseDto();
      // @ts-expect-error
      response.carrier.result = favorite.carrier;
      response.carrier.result.user = new UserOneResponseDto();
      response.carrier.result.user.result = favorite.carrier.user;
      response.carrier.result.vehicle = new VehicleOneResponseDto();
      response.carrier.result.vehicle.result = favorite.carrier.vehicle;
      response.carrier.result.city = new CityOneResponseDto();
      response.carrier.result.city.result = favorite.carrier.city;
      response.carrier.result.district = new DistrictOneResponseDto();
      // @ts-expect-error
      response.carrier.result.district.result = favorite.carrier.district;

      return response;
    });

    return result;
  }
  @ApiParam({
    name: "id",
    description: "The favorite's id",
    type: Number,
    example: 1
  })
  @Get(':id')
  @ApiNotFoundResponse({ description: "Favorite not found" })
  @UseFilters(InternalServerErrorFilter)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    const favorite = await this.favoriteService.findOneWithJoin(+id, user);
  
    if (!favorite) throw new BadRequestException("Favorite not found");

    const response = new FavoriteOneResponseDto();
    response.result = new FavoriteResponseDto();
    response.result.user = new UserOneResponseDto();
    response.result.user.result = favorite.user;
    response.result.carrier = new CarrierOneResponseDto();
    // @ts-expect-error
    response.result.carrier.result = favorite.carrier;
    response.result.carrier.result.user = new UserOneResponseDto();
    response.result.carrier.result.user.result = favorite.carrier.user;
    response.result.carrier.result.vehicle = new VehicleOneResponseDto();
    response.result.carrier.result.vehicle.result = favorite.carrier.vehicle;
    response.result.carrier.result.city = new CityOneResponseDto();
    response.result.carrier.result.city.result = favorite.carrier.city;
    response.result.carrier.result.district = new DistrictOneResponseDto();
    // @ts-expect-error
    response.result.carrier.result.district.result = favorite.carrier.district;

    return response;
  }

  @ApiParam({
    name: "id",
    description: "The favorite's id",
    type: Number,
    example: 1
  })
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  async update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    try {
      await this.favoriteService.update(+id, updateFavoriteDto);

      return {
        message: "Favorite updated successfully"
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  async remove(@Param('id') id: string) {
    await this.favoriteService.remove(+id);

    return {
      message: "Favorite deleted successfully"
    };
  }
}
