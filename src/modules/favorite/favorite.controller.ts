import { Controller, Get, Post, Body, Patch, Param, Delete, SerializeOptions, ClassSerializerInterceptor, UseInterceptors, UseGuards, BadRequestException, Query } from '@nestjs/common';
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
import { FavoriteQueryOrderDirection } from './favorite.enums';
import { PagedFavoriteResponseDto } from './dto/paged-favorite-response.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserOneResponseDto } from '../users/dto/user-one-response.dto';
import { CarrierOneResponseDto } from '../carrier/dto/carrier-one-response.dto';
import { CityOneResponseDto } from '../cities/dto/city-one-response.dto';
import { DistrictOneResponseDto } from '../districts/dto/district-one-response.dto';
import { VehicleOneResponseDto } from '../vehicles/dto/vehicle-one-response.dto';
import { FavoriteResponseDto } from './dto/favorite.response.dto';

@ApiTags("favorites")
@ApiBearerAuth()
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseInterceptors(ClassSerializerInterceptor)
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  // @UseGuards(RolesGuard)
  // @Roles(RoleEnum.USER)
  async create(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @CurrentUser() user: User
  ) {
    try {
      const favorite = await this.favoriteService.create(createFavoriteDto, user);
      console.log(favorite);

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
  async findAll(@Query() query: QueryFavoriteDto) {
    const limit: number = query.limit ?? 10;
    const page: number = query.page ?? 1;
    const skip = (page - 1) * limit;

    const orderBy = query.orderBy ?? -1;
    const sort: SortByObject = {};
    sort[orderBy] =
      query.orderDirection === FavoriteQueryOrderDirection.DESC ? -1 : 1;

    const queryObject = {
      ...(query.carrierId && { carrierId: query.carrierId }),
      ...(query.userId && { userId: query.userId })
    };

    const count = await this.favoriteService.findAll(
      queryObject,
      undefined,
      undefined,
      null
    );

    const results = await this.favoriteService.findAll(
      queryObject,
      limit,
      skip,
      sort
    );

    const result = new PagedFavoriteResponseDto();
    result.count = count[1];
    result.page = page;
    result.limit = limit;

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
  // @UseGuards(RolesGuard)
  // @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    const favorite = await this.favoriteService.findOneWithJoin(+id);
  
    if (!favorite) throw new BadRequestException("Favorite not found");

    const response = new FavoriteOneResponseDto();
    response.result = new FavoriteResponseDto();
    response.result.user = new UserOneResponseDto();
    response.result.user.result = favorite.user;
    response.result.carrier = new CarrierOneResponseDto();
    console.log(favorite.carrier);
    response.result.carrier.result.city = new CityOneResponseDto();
  
    response.result.carrier.result.city.result = favorite.carrier.city;
    response.result.carrier.result.district = new DistrictOneResponseDto();
    response.result.carrier.result.district.result = favorite.carrier.district;
    response.result.carrier.result.user = new UserOneResponseDto();
    response.result.carrier.result.user.result = favorite.carrier.user;
    response.result.carrier.result.vehicle = new VehicleOneResponseDto();
    response.result.carrier.result.vehicle.result = favorite.carrier.vehicle;

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
      const favorite = await this.favoriteService.update(+id, updateFavoriteDto);

      const response = new FavoriteOneResponseDto();
      response.result = favorite;
      return response;
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