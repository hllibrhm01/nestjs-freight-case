import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany
  } from "typeorm";
  import { CommonEntity } from "../../common/entities/common.entity";
import { City } from "../../cities/entities/city.entity";
import { Carrier } from "src/modules/carrier/entities/carrier.entity";
  
  @Entity()
  export class District extends CommonEntity {
    @Column({ type: "int", nullable: false })
    cityId: number;
  
    @Column({ type: "varchar", nullable: false })
    name: string;

    @ManyToOne('City', 'districts')
    city: City;

    @OneToMany('Carrier', 'district')
    carriers: Carrier[];
  }
  