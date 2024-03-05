import { Body, Injectable, Param } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { CommonService } from '../common/common.service';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RoleEnum } from '../roles/roles.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FavoriteService extends CommonService<Favorite> {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private usersService: UsersService
  ) {
    super(favoriteRepository);
  }

  async create(createFavoriteDto: CreateFavoriteDto, user: User) {
    const favorite = this.favoriteRepository.create(createFavoriteDto);

    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId: createFavoriteDto.userId, carrierId: createFavoriteDto.carrierId }
    });

    if (existingFavorite !== null) 
      throw new Error('Favorite with this user and carrier already exists');

    return this.favoriteRepository.save(favorite);
  }

  async update(@Param('id') id: number, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    const favorite = await this.favoriteRepository.findOne({ where: { id } });

    if (!favorite) throw new Error('Favorite not found');

    if (updateFavoriteDto.userId) favorite.userId = updateFavoriteDto.userId;
    if (updateFavoriteDto.carrierId) favorite.carrierId = updateFavoriteDto.carrierId;

    return await this.favoriteRepository.save(favorite);
  }

  async findOneWithJoin(id: number): Promise<Favorite> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id },
      relations: ['user', 'carrier', 'carrier.city', 'carrier.district', 'carrier.user', 'carrier.vehicle']
    });

    if (!favorite) throw new Error('Favorite not found');

    return favorite;
  }
}
