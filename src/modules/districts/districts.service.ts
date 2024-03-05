import { Body, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { CommonService } from '../common/common.service';
import { District } from './entities/district.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CitiesService } from '../cities/cities.service';
import { DistrictQueryOrderBy, DistrictQueryOrderDirection } from './districts.enums';

@Injectable()
export class DistrictsService extends CommonService<District> {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    private citiesService: CitiesService
  ) {
    super(districtRepository);
  }
  async create(createDistrictDto: CreateDistrictDto) {
    const district = this.districtRepository.create(createDistrictDto);

    const existingCity = await this.citiesService.findOne(createDistrictDto.cityId);

    if (!existingCity) 
      throw new Error('City not found');

    const existingDistrict = await this.districtRepository.findOne({
      where: { name: createDistrictDto.name }
    });

    if (existingDistrict !== null) 
      throw new Error('District with this name already exists');

    return this.districtRepository.save(district);
  }

  async update(
    @Param('id') id: number,
    @Body() updateDistrictDto: UpdateDistrictDto
  ) {
    const district = await this.districtRepository.findOne({ where: { id } });


    if (!district) throw new Error('District not found');

    if (updateDistrictDto.name) {
      const existingDistrict = await this.districtRepository.findOne({
        where: { name: updateDistrictDto.name }
      });

      if (existingDistrict !== null) 
        throw new Error('District with this name already exists');

      district.name = updateDistrictDto.name;
    }
    if (updateDistrictDto.cityId) {
      const existingCity = await this.citiesService.findOne(updateDistrictDto.cityId);

      if (!existingCity) 
        throw new Error('City not found');

      district.cityId = updateDistrictDto.cityId;
    }

    return await this.districtRepository.save(district);
  }

  async findOneWithJoin(id: number): Promise<District> {
    const district = await this.districtRepository.findOne({
      where: { id },
      relations: ["city"]
    });

    if (!district)
      throw new NotFoundException(`District's not found`);

    return district;
  }

  async checkMatchWithCity(id: number, cityId: number) {
    const district = await this.districtRepository.findOne({ where: { id } });

    if (!district)
      throw new NotFoundException(`District's not found`);

    if (district.cityId !== cityId)
      throw new Error(`District's city doesn't match with city`);
  }

  async getDistrictsWithJoin(
    cityId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    orderBy: DistrictQueryOrderBy | undefined,
    orderDirection: DistrictQueryOrderDirection,
    count: true
  ): Promise<number>;
  async getDistrictsWithJoin(
    cityId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    orderBy: DistrictQueryOrderBy | undefined,
    orderDirection: DistrictQueryOrderDirection,
    count: false
  ): Promise<District[]>;
  async getDistrictsWithJoin(
    cityId: number | undefined,
    limit: number | undefined = 10,
    skip: number | undefined = 0,
    orderBy: DistrictQueryOrderBy | undefined,
    orderDirection: DistrictQueryOrderDirection | undefined,
    count: boolean = false
  ): Promise<District[] | number> {
    const queryBuilder: SelectQueryBuilder<District> =
      this.districtRepository.createQueryBuilder("district");

    const query = queryBuilder
      .innerJoinAndSelect("district.city", "city");

    if (cityId !== undefined) query.where("district.cityId = :id", { id: cityId });

    if (count) return query.getCount();

    return query
      .orderBy(`district.${orderBy}`, orderDirection)
      .skip(skip)
      .take(limit)
      .getMany();
  }
}
