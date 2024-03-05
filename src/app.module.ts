import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./modules/users/users.module";
import { User } from "./modules/users/entities/user.entity";
import { AuthModule } from "./modules/auth/auth.module";
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { APP_GUARD } from "@nestjs/core";
import { Token } from "./modules/auth/entities/token.entity";
import { TokenModule } from "./modules/token/token.module";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { AppService } from "./app.service";
import { CarrierModule } from './modules/carrier/carrier.module';
import { Carrier } from "./modules/carrier/entities/carrier.entity";
import { CitiesModule } from './modules/cities/cities.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { District } from "./modules/districts/entities/district.entity";
import { City } from "./modules/cities/entities/city.entity";
import { Vehicle } from "./modules/vehicles/entities/vehicle.entity";
import { Favorite } from "./modules/favorite/entities/favorite.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.local"],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DATABASE_HOST"),
        port: configService.get("DATABASE_PORT"),
        username: configService.get("DATABASE_USER"),
        password: configService.get("DATABASE_PASSWORD"),
        database: configService.get("DATABASE_NAME"),
        entities: [
          User, 
          Token, 
          City,
          District,
          Vehicle,
          Carrier,
          Favorite
        ],
        synchronize: true,
        logging: false,
        softDelete: true,
        // dropSchema: true
        // ssl: {
        //   ca: fs.readFileSync("./src/ca-certificate.crt").toString()
        // }
      }),
      inject: [ConfigService]
    }),
    TokenModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        localPort: configService.get("PORT"),
        privateKey: configService.get("JWT_PRIVATE"),
        localPublicKey: configService.get("JWT_MOCK_PUBLIC")
      }),
      inject: [ConfigService]
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV === "development",
      port: 8001
    }),
    UsersModule,
    AuthModule,
    CitiesModule,
    DistrictsModule,
    VehiclesModule,
    CarrierModule,
    FavoriteModule
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
