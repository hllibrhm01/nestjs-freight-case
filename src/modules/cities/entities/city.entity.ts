import {
    Column,
    Entity,
    JoinColumn,
    OneToMany
} from "typeorm";
import { CommonEntity } from "../../common/entities/common.entity";
import { District } from "../../districts/entities/district.entity";
import { Country } from "../../contants/country.enums";
import { Carrier } from "src/modules/carrier/entities/carrier.entity";

  @Entity()
  export class City extends CommonEntity {
    // a table can be made in the future
    // will fix this later
    @Column({ 
      type: "varchar", 
      default: Country.Turkey,
      nullable: false
    })
    countryId: number;
  
    @Column({ 
      type: "varchar", 
      nullable: false
    })
    name: string;

    @OneToMany('District', 'city')
    districts: District[];

    @OneToMany('Carrier', 'city')
    carriers: Carrier[];
  }
  