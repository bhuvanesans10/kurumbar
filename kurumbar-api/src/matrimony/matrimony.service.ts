import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMatrimonyDto } from "./dto/create-matrimony.dto";
import { QueryMatrimonyDto } from "./dto/query-matrimony.dto";
import { Gender, MatrimonyStatus } from "src/prisma/generated/enums";
import { Prisma } from "src/prisma/generated/client";

@Injectable()
export class MatrimonyService {
  private readonly logger = new Logger(MatrimonyService.name);

  constructor(private readonly prisma: PrismaService) {}

  generateProfileId(gender: Gender): string {
    const genderPrefix =
      gender === Gender.MALE ? "M" : gender === Gender.FEMALE ? "F" : "O";
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `KMP-${genderPrefix}-${randomSuffix}`;
  }

  async create(dto: CreateMatrimonyDto) {
    const profileId = this.generateProfileId(dto.gender);

    const profile = await this.prisma.matrimonyProfile.create({
      data: {
        profileId,
        nameTa: dto.nameTa.trim(),
        nameEn: dto.nameEn.trim(),
        gender: dto.gender,
        age: dto.age,
        dob: dto.dob?.trim() || null,
        height: dto.height?.trim() || null,
        education: dto.education.trim(),
        profession: dto.profession.trim(),
        income: dto.income?.trim() || null,
        kulam: dto.kulam.trim(),
        subKulam: dto.subKulam?.trim() || null,
        raasi: dto.raasi?.trim() || null,
        nakshatram: dto.nakshatram?.trim() || null,
        district: dto.district.trim(),
        city: dto.city?.trim() || null,
        fatherName: dto.fatherName?.trim() || null,
        motherName: dto.motherName?.trim() || null,
        contactPhone: dto.contactPhone.trim(),
        photoUrl: dto.photoUrl?.trim() || null,
        expectations: dto.expectations?.trim() || null,
        status: MatrimonyStatus.PENDING,
      },
    });

    this.logger.log(
      `Created matrimony profile: ${profile.nameEn} (${profile.profileId})`,
    );
    return profile;
  }

  async findAll(query: QueryMatrimonyDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;

    const where: Prisma.MatrimonyProfileWhereInput = {};

    if (query.status) {
      where.status = query.status;
    } else {
      // Default to approved for public queries unless explicitly overridden
      where.status = MatrimonyStatus.APPROVED;
    }

    if (query.gender) {
      where.gender = query.gender;
    }

    if (query.kulam && query.kulam.trim() !== "ALL") {
      where.kulam = {
        contains: query.kulam.trim(),
        mode: "insensitive",
      };
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
        { education: { contains: search, mode: "insensitive" } },
        { profession: { contains: search, mode: "insensitive" } },
        { kulam: { contains: search, mode: "insensitive" } },
        { profileId: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.matrimonyProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.matrimonyProfile.count({ where }),
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
    const profile = await this.prisma.matrimonyProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(
        `Matrimony profile with ID "${id}" was not found.`,
      );
    }

    return profile;
  }

  async findByProfileId(profileId: string) {
    const profile = await this.prisma.matrimonyProfile.findUnique({
      where: { profileId: profileId.trim() },
    });

    if (!profile) {
      throw new NotFoundException(
        `Matrimony profile "${profileId}" was not found.`,
      );
    }

    return profile;
  }

  async updateStatus(id: string, status: MatrimonyStatus) {
    await this.findById(id);

    const updated = await this.prisma.matrimonyProfile.update({
      where: { id },
      data: { status },
    });

    this.logger.log(`Updated profile ${id} status to ${status}`);
    return updated;
  }
}
