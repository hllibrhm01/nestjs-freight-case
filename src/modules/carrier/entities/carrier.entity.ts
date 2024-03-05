import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne
  } from "typeorm";
import { CommonEntity } from "../../common/entities/common.entity";
import { Vehicle } from "src/modules/vehicles/entities/vehicle.entity";
import { City } from "src/modules/cities/entities/city.entity";
import { District } from "src/modules/districts/entities/district.entity";
import { User } from "src/modules/users/entities/user.entity";

@Entity()
export class Carrier extends CommonEntity {
    @Column({ type: "varchar", nullable: false })
    companyName: string;

    @Column({ type: "varchar", nullable: false })
    phoneNumber: string;

    @Column({ type: "int", nullable: false })
    userId: number;

    @Column({ type: "int", nullable: false })
    vehicleId: number;

    @Column({ type: "varchar", nullable: false })
    vehiclePlateNumber: string;

    @Column({ type: "int", nullable: false })
    cityId: number;

    @Column({ type: "int", nullable: false })
    districtId: number;

    @Column({ type: "float", nullable: true })
    discountRate: number;

    @Column({ type: "varchar", nullable: true })
    promotionalOffers: string;

    @ManyToOne('Vehicle', 'carriers')
    vehicle: Vehicle;

    @ManyToOne('City', 'carriers')
    city: City;

    @ManyToOne('District', 'carriers')
    district: District;

    @OneToOne('User', 'carrier')
    @JoinColumn()
    user: User;
}
