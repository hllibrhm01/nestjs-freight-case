import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { RoleEnum } from "../roles/roles.enum";

export function getCreateUserDto(): CreateUserDto {
  return {
    email: "mockuser@example.com",
    password: "mockpassword",
    role: RoleEnum.CARRIER
    } as unknown as User;
}

export function getUpdateUserDto(): UpdateUserDto {
  return {
    email: "updatemockuser@example.com",
    password: "updatemockpassword",
    role: RoleEnum.CARRIER
    };
}

export function getUserOne(): User {
  return {
    id: 1,
    email: "mockuser@example.com",
    role: RoleEnum.CARRIER,
    toObject: jest.fn().mockReturnValue,
    createdAt: new Date(1897, 0, 28),
    updatedAt: new Date(1898, 0, 28)
    } as unknown as User;
}

export function getUserTwo(): User {
  return {
    id: 2,
    email: "mockuser2@example.com",
    role: RoleEnum.CARRIER,
    toObject: jest.fn().mockReturnValue,
    createdAt: new Date(1897, 0, 28),
    updatedAt: new Date(1898, 0, 28)
    } as unknown as User;
}

export function getQueryUserDto(): QueryUserDto {
  return {
    email: "mockuser@example.com",
    name: "mockuser",
    lastname: "mocklastname",
    status: true,
    role: RoleEnum.CARRIER,
    limit: 5,
    page: 1
    };
}

export function makeUser(
    optionalValues: Partial<User> = {}
): User {
    return {
        email: optionalValues.email ?? "mockuser@example.com",
        role: optionalValues.role ?? RoleEnum.CARRIER
    } as unknown as User;
}
