import { CreateCityDto } from "./dto/create-city.dto";
import { QueryCityDto } from "./dto/query-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { City } from "./entities/city.entity";
import { Country } from "../contants/country.enums";

export function getCreateCityDto(): City {
  return {
    name: "Beşiktaş"
  } as unknown as City;
}

export function getUpdateCityDto(): UpdateCityDto {
  return {
    name: "İzmir"
  };
}

export function getCityOne(): City {
  return {
    id: 1,
    name: "Kocaeli",
    toObject: jest.fn().mockReturnValue,
    createdAt: new Date(1897, 0, 28),
    updatedAt: new Date(1898, 0, 28)
  } as unknown as City;
}

export function getCityTwo(): City {
  return {
    id: 2,
    name: "Istanbul",
    toObject: jest.fn().mockReturnValue,
    createdAt: new Date(1897, 0, 28),
    updatedAt: new Date(1898, 0, 28)
  } as unknown as City;
}

export function getQueryCityDto(): QueryCityDto {
  return {
    name: "Istanbul",
    limit: 5,
    page: 1
  };
}

export function makeCity(
    optionalValues: Partial<City> = {}
): City {
    return {
        name: optionalValues.name ?? "Istanbul",
    } as unknown as City;
}
