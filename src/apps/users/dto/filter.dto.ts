import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsIn, IsOptional } from "class-validator";
import { userRoles } from "../entities/user-role.entity";

export class FilterQueryDto {
    @ApiPropertyOptional()
    @IsIn(userRoles, {each: true})
    @IsOptional()
    roles: string;

    @ApiPropertyOptional()   
    @IsDateString()
    @IsOptional()
    fromDate: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    toDate: string;
}