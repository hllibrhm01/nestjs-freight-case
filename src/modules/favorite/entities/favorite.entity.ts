import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import { CommonEntity } from "../../common/entities/common.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Carrier } from "src/modules/carrier/entities/carrier.entity";

@Entity()
export class Favorite extends CommonEntity {
    @Column({ type: "int", nullable: false })
    userId: number;

    @Column({ type: "int", nullable: false })
    carrierId: number;

    @ManyToOne('User', 'favorites')
    @JoinColumn()
    user: User;

    @ManyToOne('Carrier', 'favorites')
    @JoinColumn()
    carrier: Carrier;
    
    // will add carrier relation
    // will add user relation
}
