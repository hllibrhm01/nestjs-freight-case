import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
  } from "typeorm";
  import { CommonEntity } from "../../common/entities/common.entity";
import { Carrier } from "src/modules/carrier/entities/carrier.entity";
  
@Entity()
export class Vehicle extends CommonEntity {
    @Column({ type: "varchar", nullable: false })
    brand: string;
    
    @Column({ type: "varchar", nullable: false })
    model: string;
    
    @Column({ type: "varchar", nullable: false })
    color: string;
    
    @Column({ type: "varchar", nullable: false })
    year: number;
    
   @Column({ type: "varchar", nullable: false })
    type: string;
    
    @Column({ type: "boolean", default: true, nullable: false })
    status: boolean;

    @OneToMany('Carrier', 'vehicle')
    carriers: Carrier[];
}
