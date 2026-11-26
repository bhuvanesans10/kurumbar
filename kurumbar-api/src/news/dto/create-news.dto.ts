import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";
import { NewsCategory } from "src/prisma/generated/enums";

const TrimString = () =>
  Transform(({ value }) =>
    typeof value === "string"
      ? value.trim() === ""
        ? undefined
        : value.trim()
      : value,
  );

export class CreateNewsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  titleTa!: string;

  @IsOptional()
  @IsString()
  @TrimString()
  titleEn?: string;

  @IsNotEmpty()
  @IsEnum(NewsCategory)
  category!: NewsCategory;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @TrimString()
  summaryTa!: string;

  @IsOptional()
  @IsString()
  @TrimString()
  summaryEn?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  content?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  eventDate?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  eventLocation?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = true;
}
