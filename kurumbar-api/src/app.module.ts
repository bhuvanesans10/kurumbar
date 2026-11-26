import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SentryModule } from "@sentry/nestjs/setup";
import { LoggerModule } from "./common/logger/logger.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { MembersModule } from "./members/members.module";
import { MatrimonyModule } from "./matrimony/matrimony.module";
import { MarketModule } from "./market/market.module";
import { JobsModule } from "./jobs/jobs.module";
import { NewsModule } from "./news/news.module";
import { ShutdownObserver } from "./util/middlewares/shutdown-observer";

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    MembersModule,
    MatrimonyModule,
    MarketModule,
    JobsModule,
    NewsModule,
    SentryModule.forRoot(),
  ],
  providers: [ShutdownObserver],
})
export class AppModule {}
