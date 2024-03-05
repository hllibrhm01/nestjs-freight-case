import { Body, Injectable, Param } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CommonService } from '../common/common.service';
import { City } from './entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CitiesService extends CommonService<City> {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>
  ) {
    super(cityRepository);
  }

  async create(createCityDto: CreateCityDto) {
    const city = this.cityRepository.create(createCityDto);

    const existingCity = await this.cityRepository.findOne({
      where: { name: createCityDto.name }
    });

    if (existingCity !== null) 
      throw new Error('City with this name already exists');

    return this.cityRepository.save(city);
  }

  async update(
    @Param('id') id: number,
    @Body() updateCityDto: UpdateCityDto
  ) {
    const city = await this.cityRepository.findOne({ where: { id } });

    if (!city) throw new Error('City not found');

    if (updateCityDto.name) city.name = updateCityDto.name;

    return await this.cityRepository.save(city);
  }

}
