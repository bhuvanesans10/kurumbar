import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";
import { JobType } from "src/prisma/generated/enums";

const TrimString = () =>
  Transform(({ value }) =>
    typeof value === "string"
      ? value.trim() === ""
        ? undefined
        : value.trim()
      : value,
  );

export class CreateJobDto {
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
  @IsString()
  @MinLength(2)
  @TrimString()
  company!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  location!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @TrimString()
  district!: string;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType = JobType.FULL_TIME;

  @IsOptional()
  @IsString()
  @TrimString()
  salaryRange?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  experience?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  education?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  description?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @TrimString()
  contactEmail?: string;
}
