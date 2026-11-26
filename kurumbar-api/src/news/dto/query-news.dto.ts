import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { NewsCategory } from "src/prisma/generated/enums";

const TrimString = () =>
  Transform(({ value }) =>
    typeof value === "string"
      ? value.trim() === ""
        ? undefined
        : value.trim()
      : value,
  );

export class QueryNewsDto {
  @IsOptional()
  @IsEnum(NewsCategory)
  category?: NewsCategory;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPublished?: boolean = true;

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
