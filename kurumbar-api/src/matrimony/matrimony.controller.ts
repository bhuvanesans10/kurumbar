import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MatrimonyService } from "./matrimony.service";
import { CreateMatrimonyDto } from "./dto/create-matrimony.dto";
import { UpdateMatrimonyStatusDto } from "./dto/update-matrimony-status.dto";
import { QueryMatrimonyDto } from "./dto/query-matrimony.dto";
import { Public } from "src/decorators/public.decorator";

@ApiTags("Matrimony")
@Controller("matrimony")
export class MatrimonyController {
  constructor(private readonly matrimonyService: MatrimonyService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new matrimony profile (வரன் பதிவு)" })
  @ApiResponse({ status: 201, description: "Profile registered successfully" })
  async create(@Body() createMatrimonyDto: CreateMatrimonyDto) {
    return this.matrimonyService.create(createMatrimonyDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "List matrimony profiles with filters & search" })
  async findAll(@Query() query: QueryMatrimonyDto) {
    return this.matrimonyService.findAll(query);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get matrimony profile by ID" })
  async findOne(@Param("id") id: string) {
    return this.matrimonyService.findById(id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update matrimony profile status (Admin)" })
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateMatrimonyStatusDto,
  ) {
    return this.matrimonyService.updateStatus(id, dto.status);
  }
}
