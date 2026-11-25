import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMemberDto } from "./dto/create-member.dto";
import { QueryMembersDto } from "./dto/query-members.dto";
import { MemberStatus, Gender } from "src/prisma/generated/enums";

@Injectable()
export class MembersService {
  private readonly logger = new Logger(MembersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a unique, standardized Kurumbar Membership ID
   * Format: TN[DistrictCode][M/F/O][YearPaddedSequential] e.g. TN04M0001042
   */
  generateMembershipId(district: string, gender: Gender): string {
    const districtPrefix = district.slice(0, 2).toUpperCase() || "TN";
    const genderCode =
      gender === Gender.MALE ? "M" : gender === Gender.FEMALE ? "F" : "O";
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    return `TN${districtPrefix}${genderCode}${randomSuffix}`;
  }

  async create(dto: CreateMemberDto) {
    // Check if mobile already exists
    const existing = await this.prisma.member.findUnique({
      where: { mobile: dto.mobile.trim() },
    });

    if (existing) {
      throw new ConflictException(
        "A member with this mobile number is already registered.",
      );
    }

    const membershipId = this.generateMembershipId(dto.district, dto.gender);

    // Normalize empty strings to null defensively per repository standards
    const createdMember = await this.prisma.member.create({
      data: {
        membershipId,
        nameTa: dto.nameTa.trim(),
        nameEn: dto.nameEn.trim(),
        mobile: dto.mobile.trim(),
        gender: dto.gender,
        dob: dto.dob?.trim() || null,
        bloodGroup: dto.bloodGroup?.trim() || null,
        fatherName: dto.fatherName?.trim() || null,
        maritalStatus: dto.maritalStatus?.trim() || null,
        childrenMale: dto.childrenMale ?? 0,
        childrenFemale: dto.childrenFemale ?? 0,
        district: dto.district.trim(),
        constituency: dto.constituency?.trim() || null,
        address: dto.address.trim(),
        pincode: dto.pincode.trim(),
        kulam: dto.kulam.trim(),
        kuladeivam: dto.kuladeivam?.trim() || null,
        education: dto.education?.trim() || null,
        professionSector: dto.professionSector?.trim() || null,
        jobTitle: dto.jobTitle?.trim() || null,
        houseType: dto.houseType?.trim() || null,
        landAvailable: dto.landAvailable?.trim() || null,
        landDetails: dto.landDetails?.trim() || null,
        photoUrl: dto.photoUrl?.trim() || null,
        aadhaarMasked: dto.aadhaarMasked?.trim() || null,
        status: MemberStatus.PENDING,
      },
    });

    this.logger.log(
      `Registered new member: ${createdMember.nameEn} (${createdMember.membershipId})`,
    );

    return createdMember;
  }

  async findAll(query: QueryMembersDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
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
        { nameTa: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } },
        { membershipId: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.member.count({ where }),
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
    const member = await this.prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID "${id}" was not found.`);
    }

    return member;
  }

  async findByMembershipId(membershipId: string) {
    const member = await this.prisma.member.findUnique({
      where: { membershipId: membershipId.trim() },
    });

    if (!member) {
      throw new NotFoundException(
        `Member with Membership ID "${membershipId}" was not found.`,
      );
    }

    return member;
  }

  async updateStatus(id: string, status: MemberStatus) {
    // Check if member exists
    await this.findById(id);

    const updated = await this.prisma.member.update({
      where: { id },
      data: { status },
    });

    this.logger.log(`Updated member ${id} status to ${status}`);
    return updated;
  }
}
