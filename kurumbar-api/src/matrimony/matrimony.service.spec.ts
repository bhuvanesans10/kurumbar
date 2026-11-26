import { Test, TestingModule } from "@nestjs/testing";
import { MatrimonyService } from "./matrimony.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { Gender, MatrimonyStatus } from "src/prisma/generated/enums";
import { CreateMatrimonyDto } from "./dto/create-matrimony.dto";

describe("MatrimonyService", () => {
  let service: MatrimonyService;
  let prismaMock: {
    matrimonyProfile: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };
  let module: TestingModule;

  const mockProfile = {
    id: "clmat123456789",
    profileId: "KMP-M-101",
    nameTa: "சு. ஆனந்தகுமார்",
    nameEn: "S. Anandhakumar",
    gender: Gender.MALE,
    age: 28,
    dob: "1998-05-14",
    height: "5' 9\"",
    education: "B.Tech IT",
    profession: "Software Engineer",
    income: "₹14,00,000 / ஆண்டு",
    kulam: "செல்ல குலம்",
    subKulam: "பெரியான குலம்",
    raasi: "ரிஷபம்",
    nakshatram: "ரோகிணி",
    district: "ஈரோடு (Erode)",
    city: "அந்தியூர்",
    fatherName: "சுப்பிரமணியன்",
    motherName: "சாந்தி",
    contactPhone: "9443212345",
    photoUrl: "https://example.com/photo.jpg",
    expectations: "பட்டதாரி மணமகள்",
    status: MatrimonyStatus.APPROVED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaMock = {
      matrimonyProfile: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    module = await Test.createTestingModule({
      providers: [
        MatrimonyService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<MatrimonyService>(MatrimonyService);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("generateProfileId", () => {
    it("should format profile ID with gender code", () => {
      const maleId = service.generateProfileId(Gender.MALE);
      expect(maleId).toMatch(/^KMP-M-\d{4}$/);

      const femaleId = service.generateProfileId(Gender.FEMALE);
      expect(femaleId).toMatch(/^KMP-F-\d{4}$/);
    });
  });

  describe("create", () => {
    const createDto: CreateMatrimonyDto = {
      nameTa: "சு. ஆனந்தகுமார்",
      nameEn: "S. Anandhakumar",
      gender: Gender.MALE,
      age: 28,
      education: "B.Tech IT",
      profession: "Software Engineer",
      kulam: "செல்ல குலம்",
      district: "Erode",
      contactPhone: "9443212345",
    };

    it("should create profile with PENDING status", async () => {
      prismaMock.matrimonyProfile.create.mockResolvedValue(mockProfile);

      const result = await service.create(createDto);

      expect(prismaMock.matrimonyProfile.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            nameTa: "சு. ஆனந்தகுமார்",
            nameEn: "S. Anandhakumar",
            status: MatrimonyStatus.PENDING,
          }),
        }),
      );
      expect(result).toEqual(mockProfile);
    });

    it("should normalize empty strings and trim whitespace to null", async () => {
      prismaMock.matrimonyProfile.create.mockResolvedValue(mockProfile);

      await service.create({
        ...createDto,
        dob: "   ",
        income: "",
        city: undefined,
      });

      expect(prismaMock.matrimonyProfile.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dob: null,
            income: null,
            city: null,
          }),
        }),
      );
    });
  });

  describe("findAll", () => {
    it("should return paginated list of approved profiles by default", async () => {
      prismaMock.matrimonyProfile.findMany.mockResolvedValue([mockProfile]);
      prismaMock.matrimonyProfile.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(prismaMock.matrimonyProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: MatrimonyStatus.APPROVED,
          }),
        }),
      );
    });

    it("should filter by gender, kulam, district and search", async () => {
      prismaMock.matrimonyProfile.findMany.mockResolvedValue([mockProfile]);
      prismaMock.matrimonyProfile.count.mockResolvedValue(1);

      await service.findAll({
        gender: Gender.MALE,
        kulam: "செல்ல குலம்",
        district: "Erode",
        search: "Anandha",
      });

      expect(prismaMock.matrimonyProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            gender: Gender.MALE,
            kulam: expect.objectContaining({ contains: "செல்ல குலம்" }),
            district: expect.objectContaining({ contains: "Erode" }),
            OR: expect.any(Array),
          }),
        }),
      );
    });
  });

  describe("findById", () => {
    it("should return profile if found", async () => {
      prismaMock.matrimonyProfile.findUnique.mockResolvedValue(mockProfile);

      const result = await service.findById("clmat123456789");
      expect(result).toEqual(mockProfile);
    });

    it("should throw NotFoundException if profile not found", async () => {
      prismaMock.matrimonyProfile.findUnique.mockResolvedValue(null);

      await expect(service.findById("not-found")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("findByProfileId", () => {
    it("should return profile if found by profileId", async () => {
      prismaMock.matrimonyProfile.findUnique.mockResolvedValue(mockProfile);

      const result = await service.findByProfileId("KMP-M-101");
      expect(result).toEqual(mockProfile);
    });

    it("should throw NotFoundException if profileId not found", async () => {
      prismaMock.matrimonyProfile.findUnique.mockResolvedValue(null);

      await expect(service.findByProfileId("INVALID")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("updateStatus", () => {
    it("should update profile status successfully", async () => {
      prismaMock.matrimonyProfile.findUnique.mockResolvedValue(mockProfile);
      prismaMock.matrimonyProfile.update.mockResolvedValue({
        ...mockProfile,
        status: MatrimonyStatus.MARRIED,
      });

      const result = await service.updateStatus(
        "clmat123456789",
        MatrimonyStatus.MARRIED,
      );
      expect(result.status).toBe(MatrimonyStatus.MARRIED);
    });

    it("should throw NotFoundException if profile to update not found", async () => {
      prismaMock.matrimonyProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus("unknown-id", MatrimonyStatus.APPROVED),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
