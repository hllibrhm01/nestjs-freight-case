import { Body, Injectable, Param } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { CommonService } from '../common/common.service';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RoleEnum } from '../roles/roles.enum';
import { User } from '../users/entities/user.entity';
import { FavoriteQueryOrderBy, FavoriteQueryOrderDirection } from './favorite.enums';

@Injectable()
export class FavoriteService extends CommonService<Favorite> {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>
  ) {
    super(favoriteRepository);
  }

  async create(createFavoriteDto: CreateFavoriteDto, user: User) {
    const favorite = this.favoriteRepository.create(createFavoriteDto);

    if (user.role !== RoleEnum.USER) 
      throw new Error('Only users can create favorites');

    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId: user.id, carrierId: createFavoriteDto.carrierId }
    });

    if (existingFavorite !== null) 
      throw new Error('Favorite with this user and carrier already exists');

    return this.favoriteRepository.save(favorite);
  }

  async update(@Param('id') id: number, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    const favorite = await this.favoriteRepository.findOne({ where: { id } });

    if (!favorite) throw new Error('Favorite not found');

    if (updateFavoriteDto.carrierId) favorite.carrierId = updateFavoriteDto.carrierId;

    return await this.favoriteRepository.save(favorite);
  }

  async getFavoritesWithJoin(
    userId: number | undefined,
    carrierId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    orderBy: FavoriteQueryOrderBy | undefined,
    orderDirection: FavoriteQueryOrderDirection,
    count: true
  ): Promise<number>;
  async getFavoritesWithJoin(
    userId: number | undefined,
    carrierId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    orderBy: FavoriteQueryOrderBy | undefined,
    orderDirection: FavoriteQueryOrderDirection,
    count: false
  ): Promise<Favorite[]>;
  async getFavoritesWithJoin(
    userId: number | undefined,
    carrierId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    orderBy: FavoriteQueryOrderBy | undefined,
    orderDirection: FavoriteQueryOrderDirection,
    count: boolean
  ): Promise<Favorite[] | number> {
    const queryBuilder: SelectQueryBuilder<Favorite> =
      this.favoriteRepository.createQueryBuilder('favorite');

    const query = queryBuilder
      .innerJoinAndSelect('favorite.user', 'user')
      .innerJoinAndSelect('favorite.carrier', 'carrier')
      .innerJoinAndSelect('carrier.city', 'city')
      .innerJoinAndSelect('carrier.district', 'district')
      .innerJoinAndSelect('carrier.user', 'carrierUser')
      .innerJoinAndSelect('carrier.vehicle', 'vehicle');  

    if (userId !== undefined) query.where('favorite.userId = :id', { id: userId });
    if (carrierId !== undefined) query.where('favorite.carrierId = :id', { id: carrierId });

    if (count) return await query.getCount();

    return query
      .orderBy(`favorite.${orderBy}`, orderDirection)
      .skip(skip)
      .take(limit)
      .getMany();
  }

  async findOneWithJoin(
    id: number,
    user: User
    ): Promise<Favorite> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id: id, userId: user.id },
      relations: ['user', 'carrier', 'carrier.city', 'carrier.district', 'carrier.user', 'carrier.vehicle']
    });

    if (!favorite) throw new Error('Favorite not found');

    return favorite;
  }
}
