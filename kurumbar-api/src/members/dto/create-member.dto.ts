import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
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

export class CreateMemberDto {
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
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message:
      "Mobile must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9",
  })
  @TrimString()
  mobile!: string;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message: "Gender must be MALE, FEMALE, or OTHER",
  })
  gender!: Gender;

  @IsOptional()
  @IsString()
  @TrimString()
  dob?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  maritalStatus?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  childrenMale?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  childrenFemale?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  district!: string;

  @IsOptional()
  @IsString()
  @TrimString()
  constituency?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @TrimString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6}$/, {
    message: "Pincode must be exactly 6 digits",
  })
  @TrimString()
  pincode!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  kulam!: string;

  @IsOptional()
  @IsString()
  @TrimString()
  kuladeivam?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  education?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  professionSector?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  houseType?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  landAvailable?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  landDetails?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  aadhaarMasked?: string;
}
