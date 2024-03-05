import { Test, TestingModule } from "@nestjs/testing";
import { DistrictsService } from "./districts.service";
import { District } from "./entities/district.entity";
import { getDistrictOne, getCreateDistrictDto, makeDistrict } from "./districts.fixtures";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { UpdateDistrictDto } from "./dto/update-district.dto";
import { CitiesService } from "../cities/cities.service";

describe("DistrictsService", () => {
  let districtsService: DistrictsService;
  let citiesService: CitiesService;
  let districtRepositoryMock: Partial<Repository<District>>;
  let districtRepositoryToken: string | Function = getRepositoryToken(District);

  beforeEach(async () => {
    const mockDistrictOne = getDistrictOne();
    districtRepositoryMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistrictsService,
        {
          provide: districtRepositoryToken,
          useClass: Repository
        },
        {
          provide: getRepositoryToken(District),
          useValue: districtRepositoryMock
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(""),
          },
        },
        {
          provide: CitiesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockDistrictOne),
            findOne: jest.fn().mockResolvedValue(mockDistrictOne),
          },
        }
      ],
    }).compile();

    districtsService = module.get<DistrictsService>(DistrictsService);
    districtRepositoryMock = module.get<Repository<District>>(districtRepositoryToken) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a district", async () => {
      const createDistrictDto = getCreateDistrictDto();

      jest.spyOn(districtRepositoryMock, "findOne").mockResolvedValue(null);

      const district = await districtsService.create(createDistrictDto);

      expect(districtRepositoryMock.create).toHaveBeenCalledWith(createDistrictDto);
      expect(districtRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { name: createDistrictDto.name }
      });
      expect(districtRepositoryMock.save).toHaveBeenCalledWith(district);
    });
  });
});
