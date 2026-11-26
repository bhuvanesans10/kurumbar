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
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobStatusDto } from "./dto/update-job-status.dto";
import { QueryJobsDto } from "./dto/query-jobs.dto";
import { Public } from "src/decorators/public.decorator";

@ApiTags("Jobs")
@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Post a job vacancy (வேலைவாய்ப்பு பதிவு)" })
  @ApiResponse({ status: 201, description: "Job posted successfully" })
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "List job postings with filters" })
  async findAll(@Query() query: QueryJobsDto) {
    return this.jobsService.findAll(query);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get job details by ID" })
  async findOne(@Param("id") id: string) {
    return this.jobsService.findById(id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update job posting status (Admin/Employer)" })
  async updateStatus(@Param("id") id: string, @Body() dto: UpdateJobStatusDto) {
    return this.jobsService.updateStatus(id, dto.status);
  }
}
