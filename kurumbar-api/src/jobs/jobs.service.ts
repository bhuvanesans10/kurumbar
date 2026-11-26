import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { QueryJobsDto } from "./dto/query-jobs.dto";
import { JobStatus, JobType } from "src/prisma/generated/enums";
import { Prisma } from "src/prisma/generated/client";

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateJobDto) {
    const job = await this.prisma.jobPosting.create({
      data: {
        titleTa: dto.titleTa.trim(),
        titleEn: dto.titleEn.trim(),
        company: dto.company.trim(),
        location: dto.location.trim(),
        district: dto.district.trim(),
        jobType: dto.jobType || JobType.FULL_TIME,
        salaryRange: dto.salaryRange?.trim() || null,
        experience: dto.experience?.trim() || null,
        education: dto.education?.trim() || null,
        description: dto.description?.trim() || null,
        contactPhone: dto.contactPhone?.trim() || null,
        contactEmail: dto.contactEmail?.trim() || null,
        status: JobStatus.ACTIVE,
      },
    });

    this.logger.log(`Created job posting: ${job.titleEn} at ${job.company}`);
    return job;
  }

  async findAll(query: QueryJobsDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;

    const where: Prisma.JobPostingWhereInput = {};

    if (query.status) {
      where.status = query.status;
    } else {
      where.status = JobStatus.ACTIVE;
    }

    if (query.jobType) {
      where.jobType = query.jobType;
    }

    if (query.district && query.district.trim() !== "ALL") {
      where.district = {
        contains: query.district.trim(),
        mode: "insensitive",
      };
    }

    if (query.search && query.search.trim()) {
      const search = query.search.trim();
      where.OR = [
        { titleTa: { contains: search, mode: "insensitive" } },
        { titleEn: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.jobPosting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.jobPosting.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const job = await this.prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException(`Job posting with ID "${id}" was not found.`);
    }

    return job;
  }

  async updateStatus(id: string, status: JobStatus) {
    await this.findById(id);

    const updated = await this.prisma.jobPosting.update({
      where: { id },
      data: { status },
    });

    this.logger.log(`Updated job ${id} status to ${status}`);
    return updated;
  }
}
