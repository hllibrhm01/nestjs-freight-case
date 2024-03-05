import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { getUserOne, getCreateUserDto, makeUser } from "./users.fixtures";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

describe("UsersService", () => {
    let usersService: UsersService;
    let userRepositoryMock: Partial<Repository<User>>;
    let userRepositoryToken: string | Function = getRepositoryToken(User);

    beforeEach(async () => {
        const mockUserOne = getUserOne();
        userRepositoryMock = {
            create: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: userRepositoryToken,
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: userRepositoryMock
                },
                {
                    provide: ConfigService,
                    useValue: {
                        getOrThrow: jest.fn().mockReturnValue(""),
                    },
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        userRepositoryMock = module.get<Repository<User>>(userRepositoryToken) as any;
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a user", async () => {
            const createUserDto = getCreateUserDto();

            jest.spyOn(userRepositoryMock, "findOne").mockResolvedValue(null);

            const user = await usersService.create(createUserDto);

            expect(userRepositoryMock.create).toHaveBeenCalledWith(createUserDto);
            expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
                where: { email: createUserDto.email }
            });
            expect(userRepositoryMock.save).toHaveBeenCalledWith(user);
        });

        it("should throw an error if user with this email already exists", async () => {
            const createUserDto = getCreateUserDto();

            jest.spyOn(userRepositoryMock, "findOne").mockResolvedValue(makeUser(createUserDto));

            await expect(usersService.create(createUserDto)).rejects.toThrowError("User with this email already exists");
        });
    });

    describe("update", () => {
        it("should update a user", async () => {
            const updateUserDto = new UpdateUserDto();
            updateUserDto.name = "new name";
            updateUserDto.lastname = "new lastname";
            updateUserDto.password = "new password";

            const user = getUserOne();
            jest.spyOn(userRepositoryMock, "findOne").mockResolvedValue(getUserOne());
            jest.spyOn(userRepositoryMock, "save").mockResolvedValue(user);

            const updatedUser = await usersService.update(user.id, updateUserDto);

            expect(updateUserDto).toBeDefined();
            expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);
        });
    });
});
