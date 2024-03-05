import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  OneToOne
} from "typeorm";
import { RoleEnum } from "../../roles/roles.enum";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { CommonEntity } from "../../common/entities/common.entity";
import { Carrier } from "src/modules/carrier/entities/carrier.entity";
import { Favorite } from "src/modules/favorite/entities/favorite.entity";

@Entity()
export class User extends CommonEntity {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  lastname: string;

  @Column({ type: "varchar", nullable: false })
  phoneNumber: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @Column({ type: "varchar", nullable: false })
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({
    type: "varchar",
    length: 15,
    default: RoleEnum.USER,
    nullable: false
  })
  role: RoleEnum;

  @Column({ type: "boolean", default: true, nullable: false })
  status: boolean;

  async isPasswordMatch(plainTextPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, this.password);
  }


}
