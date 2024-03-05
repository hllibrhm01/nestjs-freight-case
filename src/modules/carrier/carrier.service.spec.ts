import { Test, TestingModule } from "@nestjs/testing";
import { CarrierService } from "./carrier.service";
import { DistrictsService } from "../districts/districts.service";
import { UsersService } from "../users/users.service";
import { VehiclesService } from "../vehicles/vehicles.service";
import { Carrier } from "./entities/carrier.entity";
import { getCarrierOne, getCreateCarrierDto, makeCarrier } from "./carrier.fixtures";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { UpdateCarrierDto } from "./dto/update-carrier.dto";
import { RoleEnum } from "../roles/roles.enum";

describe("CarrierService", () => {
  let carrierService: CarrierService;
  let districtsService: DistrictsService;
  let usersService: UsersService;
  let vehiclesService: VehiclesService;
  let carrierRepositoryMock: Partial<Repository<Carrier>>;
  let carrierRepositoryToken: string | Function = getRepositoryToken(Carrier);

  beforeEach(async () => {
    const mockCarrierOne = getCarrierOne();
    carrierRepositoryMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarrierService,
        {
          provide: carrierRepositoryToken,
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Carrier),
          useValue: carrierRepositoryMock
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(""),
          },
        },
        {
          provide: DistrictsService,
          useValue: {
            checkMatchWithCity: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockCarrierOne),
          },
        },
        {
          provide: VehiclesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockCarrierOne),
          },
        }
      ],
    }).compile();

    carrierService = module.get<CarrierService>(CarrierService);
    carrierRepositoryMock = module.get<Repository<Carrier>>(carrierRepositoryToken) as any;
    districtsService = module.get<DistrictsService>(DistrictsService);
    usersService = module.get<UsersService>(UsersService);
    vehiclesService = module.get<VehiclesService>(VehiclesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a carrier", async () => {
      const createCarrierDto = getCreateCarrierDto();
      

      jest.spyOn(usersService, "findOne").mockResolvedValue(user as any);

      const carrier = await carrierService.create(createCarrierDto);
    });

    it("should throw an error if user is not a carrier", async () => {
      const createCarrierDto = getCreateCarrierDto();
      const user = makeCarrier({ role: RoleEnum.USER } as any);

      jest.spyOn(usersService, "findOne").mockResolvedValue(user as any);

      try {
        await carrierService.create(createCarrierDto);
      } catch (error) {
        expect(error.message).toEqual("User is not a carrier");
      }
    });

    it("should throw an error if user not found", async () => {
      const createCarrierDto = getCreateCarrierDto();
      const user = makeCarrier({ role: RoleEnum.CARRIER } as any);

      jest.spyOn(usersService, "findOne").mockResolvedValue(null);

      try {
        await carrierService.create(createCarrierDto);
      } catch (error) {
        expect(error.message).toEqual("User not found");
      }
    });

    it("should throw an error if carrier with this user already exists", async () => {
      const createCarrierDto = getCreateCarrierDto();

      jest.spyOn(usersService, "findOne").mockResolvedValue(getCarrierOne());
      jest.spyOn(carrierRepositoryMock, "findOne").mockResolvedValue(getCarrierOne());


    });
  });
});
