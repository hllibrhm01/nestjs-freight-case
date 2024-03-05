import { CreateCarrierDto } from "./dto/create-carrier.dto";
import { QueryCarrierDto } from "./dto/query-carrier.dto";
import { UpdateCarrierDto } from "./dto/update-carrier.dto";
import { Carrier } from "./entities/carrier.entity";

export function getCreateCarrierDto(): Carrier {
  return {
    userId: 1,
    vehicleId: 1,
    cityId: 1,
    districtId: 1
  } as unknown as Carrier;
}

export function getUpdateCarrierDto(): UpdateCarrierDto {
  return {
    userId: 2
  };
}

export function getCarrierOne(): Carrier {
  return {
    id: 1,
    userId: 1,
    vehicleId: 1,
    cityId: 1,
    districtId: 1,
    toObject: jest.fn().mockReturnValue,
    createdAt: new Date(1897, 0, 28),
    updatedAt: new Date(1898, 0, 28)
  } as unknown as Carrier;
}

export function getCarrierTwo(): Carrier {
  return {
    id: 2,
    userId: 2,
    vehicleId: 2,
    cityId: 2,
    districtId: 2,
    toObject: jest.fn().mockReturnValue,
    createdAt: new Date(1897, 0, 28),
    updatedAt: new Date(1898, 0, 28)
  } as unknown as Carrier;
}

export function getQueryCarrierDto(): QueryCarrierDto {
  return {
    userId: 1,
    vehicleId: 1,
    cityId: 1,
    districtId: 1,
    limit: 5,
    page: 1
  };
}

export function makeCarrier(
    optionalValues: Partial<Carrier> = {}
): Carrier {
    return {
        userId: optionalValues.userId ?? 1,
        vehicleId: optionalValues.vehicleId ?? 1,
        cityId: optionalValues.cityId ?? 1,
        districtId: optionalValues.districtId ?? 1
    } as unknown as Carrier;
}
