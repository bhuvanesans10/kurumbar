import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { ProductCategory } from "src/prisma/generated/enums";

const TrimString = () =>
  Transform(({ value }) =>
    typeof value === "string"
      ? value.trim() === ""
        ? undefined
        : value.trim()
      : value,
  );

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  titleTa!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  titleEn!: string;

  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category!: ProductCategory;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  @TrimString()
  unit?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  sellerName!: string;

  @IsNotEmpty()
  @IsString()
  @TrimString()
  sellerPhone!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  sellerDistrict!: string;

  @IsOptional()
  @IsString()
  @TrimString()
  location?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  descriptionTa?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean = true;
}
