import { Test, TestingModule } from "@nestjs/testing";
import { JobsService } from "./jobs.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { JobStatus, JobType } from "src/prisma/generated/enums";
import { CreateJobDto } from "./dto/create-job.dto";

describe("JobsService", () => {
  let service: JobsService;
  let prismaMock: {
    jobPosting: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };
  let module: TestingModule;

  const mockJob = {
    id: "cljob123456789",
    titleTa: "சீனியர் ஃபுல் ஸ்டாக் டெவலப்பர்",
    titleEn: "Senior Full-Stack Developer",
    company: "Apex Tech Innovations",
    location: "கோயம்புத்தூர் & ரிமோட்",
    district: "Coimbatore",
    jobType: JobType.FULL_TIME,
    salaryRange: "₹8,00,000 - ₹14,00,000 / ஆண்டு",
    experience: "3+ ஆண்டுகள்",
    education: "B.E / B.Tech / MCA",
    description: "React and Node.js developer",
    contactPhone: "9443212345",
    contactEmail: "careers@apextech.com",
    status: JobStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaMock = {
      jobPosting: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    module = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    const createDto: CreateJobDto = {
      titleTa: "சீனியர் ஃபுல் ஸ்டாக் டெவலப்பர்",
      titleEn: "Senior Full-Stack Developer",
      company: "Apex Tech Innovations",
      location: "Coimbatore",
      district: "Coimbatore",
      jobType: JobType.FULL_TIME,
    };

    it("should create a job posting with ACTIVE status", async () => {
      prismaMock.jobPosting.create.mockResolvedValue(mockJob);

      const result = await service.create(createDto);

      expect(prismaMock.jobPosting.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            company: "Apex Tech Innovations",
            status: JobStatus.ACTIVE,
          }),
        }),
      );
      expect(result).toEqual(mockJob);
    });

    it("should normalize empty strings and trim whitespace to null", async () => {
      prismaMock.jobPosting.create.mockResolvedValue(mockJob);

      await service.create({
        ...createDto,
        salaryRange: "   ",
        experience: "",
      });

      expect(prismaMock.jobPosting.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            salaryRange: null,
            experience: null,
          }),
        }),
      );
    });
  });

  describe("findAll", () => {
    it("should return paginated active jobs by default", async () => {
      prismaMock.jobPosting.findMany.mockResolvedValue([mockJob]);
      prismaMock.jobPosting.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(prismaMock.jobPosting.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: JobStatus.ACTIVE,
          }),
        }),
      );
    });

    it("should filter by jobType, district, and search query", async () => {
      prismaMock.jobPosting.findMany.mockResolvedValue([mockJob]);
      prismaMock.jobPosting.count.mockResolvedValue(1);

      await service.findAll({
        jobType: JobType.FULL_TIME,
        district: "Coimbatore",
        search: "Developer",
      });

      expect(prismaMock.jobPosting.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            jobType: JobType.FULL_TIME,
            district: expect.objectContaining({ contains: "Coimbatore" }),
            OR: expect.any(Array),
          }),
        }),
      );
    });
  });

  describe("findById", () => {
    it("should return job if found", async () => {
      prismaMock.jobPosting.findUnique.mockResolvedValue(mockJob);

      const result = await service.findById("cljob123456789");
      expect(result).toEqual(mockJob);
    });

    it("should throw NotFoundException if job not found", async () => {
      prismaMock.jobPosting.findUnique.mockResolvedValue(null);

      await expect(service.findById("unknown-id")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("updateStatus", () => {
    it("should update job status successfully", async () => {
      prismaMock.jobPosting.findUnique.mockResolvedValue(mockJob);
      prismaMock.jobPosting.update.mockResolvedValue({
        ...mockJob,
        status: JobStatus.CLOSED,
      });

      const result = await service.updateStatus(
        "cljob123456789",
        JobStatus.CLOSED,
      );
      expect(result.status).toBe(JobStatus.CLOSED);
    });

    it("should throw NotFoundException if job to update not found", async () => {
      prismaMock.jobPosting.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus("unknown-id", JobStatus.CLOSED),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
