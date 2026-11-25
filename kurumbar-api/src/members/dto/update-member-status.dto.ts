import { IsEnum, IsNotEmpty } from "class-validator";
import { MemberStatus } from "src/prisma/generated/enums";

export class UpdateMemberStatusDto {
  @IsNotEmpty()
  @IsEnum(MemberStatus, {
    message: "Status must be PENDING, APPROVED, or REJECTED",
  })
  status!: MemberStatus;
}
