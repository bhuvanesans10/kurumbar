import { Module } from "@nestjs/common";
import { MatrimonyService } from "./matrimony.service";
import { MatrimonyController } from "./matrimony.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [MatrimonyController],
  providers: [MatrimonyService],
  exports: [MatrimonyService],
})
export class MatrimonyModule {}
