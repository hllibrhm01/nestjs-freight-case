import { Test, TestingModule } from "@nestjs/testing";
import { CitiesService } from "./cities.service";
import { City } from "./entities/city.entity";
import { getCityOne, getCreateCityDto, makeCity } from "./cities.fixtures";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { UpdateCityDto } from "./dto/update-city.dto";

describe("CitiesService", () => {
  let citiesService: CitiesService;
  let cityRepositoryMock: Partial<Repository<City>>;
  let cityRepositoryToken: string | Function = getRepositoryToken(City); 

  beforeEach(async () => {
    const mockCityOne = getCityOne();
    cityRepositoryMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: cityRepositoryToken,
          useClass: Repository
        },
        {
          provide: getRepositoryToken(City),
          useValue: cityRepositoryMock
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(""),
          },
        },
      ],
    }).compile();

    citiesService = module.get<CitiesService>(CitiesService);
    cityRepositoryMock = module.get<Repository<City>>(cityRepositoryToken) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a city", async () => {
      const createCityDto = getCreateCityDto();

      jest.spyOn(cityRepositoryMock, "findOne").mockResolvedValue(null);

      const city = await citiesService.create(createCityDto);

      expect(cityRepositoryMock.create).toHaveBeenCalledWith(createCityDto);
      expect(cityRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { name: createCityDto.name }
      });
      expect(cityRepositoryMock.save).toHaveBeenCalledWith(city);
    });

    it("should throw an error if city already exists", async () => {
      const createCityDto = getCreateCityDto();
      const city = makeCity({ name: createCityDto.name });

      cityRepositoryMock.findOne = jest.fn().mockResolvedValue(city);

      try {
        await citiesService.create(createCityDto);
      } catch (error) {
        expect(error.message).toBe("City with this name already exists");
      }
    });
  });

  describe("update", () => {
    it("should update a city", async () => {
      const updateCityDto = new UpdateCityDto();  
      updateCityDto.name = "Izmir";
      const city = getCityOne();

      jest.spyOn(cityRepositoryMock, "findOne").mockResolvedValue(city);
      jest.spyOn(cityRepositoryMock, "save").mockResolvedValue(city);

      const updatedCity = await citiesService.update(1, updateCityDto);

      expect(cityRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(cityRepositoryMock.save).toHaveBeenCalledWith(city);
      expect(updatedCity).toEqual(city);
    });

    it("should throw an error if city not found", async () => {
      const city = getCityOne();
      jest.spyOn(cityRepositoryMock, "findOne").mockResolvedValue(null);

      await expect(citiesService.update(1, new UpdateCityDto())).rejects.toThrow("City not found");
    });
  });
});
