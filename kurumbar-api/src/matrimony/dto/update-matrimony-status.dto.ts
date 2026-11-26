import { IsEnum, IsNotEmpty } from "class-validator";
import { MatrimonyStatus } from "src/prisma/generated/enums";

export class UpdateMatrimonyStatusDto {
  @IsNotEmpty()
  @IsEnum(MatrimonyStatus)
  status!: MatrimonyStatus;
}
