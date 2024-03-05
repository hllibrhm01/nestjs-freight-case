import { Test, TestingModule } from "@nestjs/testing";
import { Request } from "express";
import { CitiesService } from "./cities.service";
import { CitiesController } from "./cities.controller";
import { 
  getCityOne, 
  getCreateCityDto,
  getUpdateCityDto,
  getQueryCityDto,
  getCityTwo
} from "./cities.fixtures";
import { PagedCityResponseDto } from "./dto/paged-city-response.dto";
import { CityResponseDto } from "./dto/city.response.dto";
import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

describe('CitiesController', () => {
  let citiesController: CitiesController;
  let citiesService: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        {
        provide: CitiesService,
        useValue: {
          create: jest.fn(),
          update: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          remove: jest.fn()
        }
      },
      {
        provide: ConfigService,
        useValue: {
          getOrThrow: jest.fn().mockReturnValue("")
        }
      }
    ],
    }).compile();

    citiesController = module.get<CitiesController>(CitiesController);
    citiesService = module.get<CitiesService>(CitiesService);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create a city", async () => {
      const mockCityOne = getCityOne();

      jest.spyOn(citiesService, "create").mockResolvedValue(mockCityOne);

      const createCityDto = getCreateCityDto();
      const city = await citiesController.create(createCityDto);

      expect(city).toBeDefined();
      expect(citiesService.create).toHaveBeenCalledWith(createCityDto);

    });
  });
});
