import { Expose, Type } from "class-transformer";
import { FavoriteResponseDto } from "./favorite.response.dto";

export class FavoriteOneResponseDto {
    @Expose()
    @Type(() => FavoriteResponseDto)
    result: FavoriteResponseDto;
}
