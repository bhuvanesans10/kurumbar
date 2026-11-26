import { IsEnum, IsNotEmpty } from "class-validator";
import { JobStatus } from "src/prisma/generated/enums";

export class UpdateJobStatusDto {
  @IsNotEmpty()
  @IsEnum(JobStatus)
  status!: JobStatus;
}
