import { Test, TestingModule } from "@nestjs/testing";
import { MembersService } from "./members.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { Gender, MemberStatus } from "src/prisma/generated/enums";
import { CreateMemberDto } from "./dto/create-member.dto";

describe("MembersService", () => {
  let service: MembersService;
  let prismaMock: any;
  let module: TestingModule;

  const mockMember = {
    id: "clrk1234567890",
    membershipId: "TN04M0001042",
    nameTa: "எஸ். புவனேசன்",
    nameEn: "S. Bhuvanesan",
    mobile: "9443212345",
    gender: Gender.MALE,
    dob: "1998-08-14",
    bloodGroup: "O+",
    fatherName: "K. Rangasamy",
    maritalStatus: "Unmarried",
    childrenMale: 0,
    childrenFemale: 0,
    district: "Salem",
    constituency: "Salem West",
    address: "142/3, Bharathi Nagar, Mettur Road",
    pincode: "636004",
    kulam: "Athi Kulam",
    kuladeivam: "Sri Beereswarar",
    education: "B.E. CSE",
    professionSector: "PRIVATE",
    jobTitle: "Software Engineer",
    houseType: "OWN",
    landAvailable: "YES",
    landDetails: "3.5 Acres",
    photoUrl: "/images/member_avatar.png",
    aadhaarMasked: "XXXX-XXXX-8942",
    status: MemberStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaMock = {
      member: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    module = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("generateMembershipId", () => {
    it("should generate formatted membership ID with district prefix and gender code", () => {
      const id = service.generateMembershipId("Salem", Gender.MALE);
      expect(id).toMatch(/^TNSA[M]\d{6}$/);
    });

    it("should handle FEMALE gender code", () => {
      const id = service.generateMembershipId("Erode", Gender.FEMALE);
      expect(id).toMatch(/^TNER[F]\d{6}$/);
    });
  });

  describe("create", () => {
    const createDto: CreateMemberDto = {
      nameTa: "எஸ். புவனேசன்",
      nameEn: "S. Bhuvanesan",
      mobile: "9443212345",
      gender: Gender.MALE,
      district: "Salem",
      address: "142/3, Bharathi Nagar",
      pincode: "636004",
      kulam: "Athi Kulam",
    };

    it("should create a new member successfully", async () => {
      prismaMock.member.findUnique.mockResolvedValue(null);
      prismaMock.member.create.mockResolvedValue(mockMember);

      const result = await service.create(createDto);

      expect(prismaMock.member.findUnique).toHaveBeenCalledWith({
        where: { mobile: "9443212345" },
      });
      expect(prismaMock.member.create).toHaveBeenCalled();
      expect(result).toEqual(mockMember);
    });

    it("should throw ConflictException if mobile number is already registered", async () => {
      prismaMock.member.findUnique.mockResolvedValue(mockMember);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaMock.member.create).not.toHaveBeenCalled();
    });

    it("should normalize empty strings and trim whitespace to null", async () => {
      prismaMock.member.findUnique.mockResolvedValue(null);
      prismaMock.member.create.mockResolvedValue(mockMember);

      const dtoWithWhitespace: CreateMemberDto = {
        ...createDto,
        dob: "   ",
        bloodGroup: "",
        fatherName: undefined,
      };

      await service.create(dtoWithWhitespace);

      expect(prismaMock.member.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dob: null,
            bloodGroup: null,
            fatherName: null,
          }),
        }),
      );
    });
  });

  describe("findAll", () => {
    it("should return paginated list of members", async () => {
      prismaMock.member.findMany.mockResolvedValue([mockMember]);
      prismaMock.member.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(prismaMock.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        }),
      );
    });

    it("should filter by status, district, and search query", async () => {
      prismaMock.member.findMany.mockResolvedValue([mockMember]);
      prismaMock.member.count.mockResolvedValue(1);

      await service.findAll({
        status: MemberStatus.PENDING,
        district: "Salem",
        search: "Bhuvanesan",
      });

      expect(prismaMock.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: MemberStatus.PENDING,
            district: expect.objectContaining({
              contains: "Salem",
            }),
            OR: expect.any(Array),
          }),
        }),
      );
    });
  });

  describe("findById", () => {
    it("should return member if found", async () => {
      prismaMock.member.findUnique.mockResolvedValue(mockMember);

      const result = await service.findById("clrk1234567890");
      expect(result).toEqual(mockMember);
    });

    it("should throw NotFoundException if member not found", async () => {
      prismaMock.member.findUnique.mockResolvedValue(null);

      await expect(service.findById("unknown-id")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("findByMembershipId", () => {
    it("should return member if membershipId found", async () => {
      prismaMock.member.findUnique.mockResolvedValue(mockMember);

      const result = await service.findByMembershipId("TN04M0001042");
      expect(result).toEqual(mockMember);
    });

    it("should throw NotFoundException if membershipId not found", async () => {
      prismaMock.member.findUnique.mockResolvedValue(null);

      await expect(service.findByMembershipId("INVALID-ID")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("updateStatus", () => {
    it("should update member status successfully", async () => {
      prismaMock.member.findUnique.mockResolvedValue(mockMember);
      const updatedMember = { ...mockMember, status: MemberStatus.APPROVED };
      prismaMock.member.update.mockResolvedValue(updatedMember);

      const result = await service.updateStatus(
        "clrk1234567890",
        MemberStatus.APPROVED,
      );

      expect(result.status).toBe(MemberStatus.APPROVED);
      expect(prismaMock.member.update).toHaveBeenCalledWith({
        where: { id: "clrk1234567890" },
        data: { status: MemberStatus.APPROVED },
      });
    });

    it("should throw NotFoundException if member to update does not exist", async () => {
      prismaMock.member.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus("unknown-id", MemberStatus.APPROVED),
      ).rejects.toThrow(NotFoundException);
      expect(prismaMock.member.update).not.toHaveBeenCalled();
    });
  });
});
