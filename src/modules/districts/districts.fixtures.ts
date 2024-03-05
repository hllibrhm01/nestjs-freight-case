import { CreateDistrictDto } from "./dto/create-district.dto";
import { QueryDistrictDto } from "./dto/query-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";
import { District } from "./entities/district.entity";

export function getCreateDistrictDto(): District {
  return {
    name: "Beşiktaş",
    cityId: 1
  } as unknown as District;
}

export function getUpdateDistrictDto(): UpdateDistrictDto {
    return {
        name: "İzmir"
    };
}

export function getDistrictOne(): District {
    return {
        id: 1,
        name: "Kocaeli",
        cityId: 1,
        toObject: jest.fn().mockReturnValue,
        createdAt: new Date(1897, 0, 28),
        updatedAt: new Date(1898, 0, 28)
    } as unknown as District;
}

export function getDistrictTwo(): District {
    return {
        id: 2,
        name: "Istanbul",
        cityId: 1,
        toObject: jest.fn().mockReturnValue,
        createdAt: new Date(1897, 0, 28),
        updatedAt: new Date(1898, 0, 28)
    } as unknown as District;
}

export function getQueryDistrictDto(): QueryDistrictDto {
    return {
        name: "Istanbul",
        cityId: 1,
        limit: 5,
        page: 1
    };
}

export function makeDistrict(
    optionalValues: Partial<District> = {}
): District {
    return {
        name: optionalValues.name ?? "Istanbul",
        cityId: optionalValues.cityId ?? 1
    } as unknown as District;
}
