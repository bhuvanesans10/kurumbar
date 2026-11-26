import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { Gender } from "src/prisma/generated/enums";

const TrimString = () =>
  Transform(({ value }) =>
    typeof value === "string"
      ? value.trim() === ""
        ? undefined
        : value.trim()
      : value,
  );

export class CreateMatrimonyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  nameTa!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  nameEn!: string;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message: "Gender must be MALE, FEMALE, or OTHER",
  })
  gender!: Gender;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(18)
  age!: number;

  @IsOptional()
  @IsString()
  @TrimString()
  dob?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  height?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  education!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  profession!: string;

  @IsOptional()
  @IsString()
  @TrimString()
  income?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  kulam!: string;

  @IsOptional()
  @IsString()
  @TrimString()
  subKulam?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  raasi?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  nakshatram?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  district!: string;

  @IsOptional()
  @IsString()
  @TrimString()
  city?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  motherName?: string;

  @IsNotEmpty()
  @IsString()
  @TrimString()
  contactPhone!: string;

  @IsOptional()
  @IsString()
  @TrimString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  expectations?: string;
}
