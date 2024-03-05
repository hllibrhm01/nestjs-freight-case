import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { UsersService } from "./modules/users/users.service";
import { RoleEnum } from "./modules/roles/roles.enum";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private userService: UsersService) {}

  onApplicationBootstrap(): any {
    this.adminUserSeed();
  }

  async adminUserSeed() {
    const count = await this.userService.findAll(
      {},
      undefined,
      undefined,
      null
    );

    if (count[1] === 0) {
      const user = {
        name: "admin",
        lastname: "admin",
        email: "admin@admin.com",
        password: "admin",
        phoneNumber: "533",
        role: RoleEnum.ADMIN,
        status: true
      };
      await this.userService.create(user);

      console.log("Admin user created");
    }
  }
}
