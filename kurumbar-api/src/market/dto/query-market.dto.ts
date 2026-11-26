import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ProductCategory, ProductStatus } from "src/prisma/generated/enums";

const TrimString = () =>
  Transform(({ value }) =>
    typeof value === "string"
      ? value.trim() === ""
        ? undefined
        : value.trim()
      : value,
  );

export class QueryMarketDto {
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  @TrimString()
  district?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
