import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { QueryMarketDto } from "./dto/query-market.dto";
import { ProductStatus } from "src/prisma/generated/enums";
import { Prisma } from "src/prisma/generated/client";

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const product = await this.prisma.marketProduct.create({
      data: {
        titleTa: dto.titleTa.trim(),
        titleEn: dto.titleEn.trim(),
        category: dto.category,
        price: dto.price,
        unit: dto.unit?.trim() || null,
        sellerName: dto.sellerName.trim(),
        sellerPhone: dto.sellerPhone.trim(),
        sellerDistrict: dto.sellerDistrict.trim(),
        location: dto.location?.trim() || null,
        descriptionTa: dto.descriptionTa?.trim() || null,
        descriptionEn: dto.descriptionEn?.trim() || null,
        imageUrl: dto.imageUrl?.trim() || null,
        isVerified: dto.isVerified ?? true,
        status: ProductStatus.ACTIVE,
      },
    });

    this.logger.log(
      `Created market product: ${product.titleEn} (${product.id})`,
    );
    return product;
  }

  async findAll(query: QueryMarketDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;

    const where: Prisma.MarketProductWhereInput = {};

    if (query.status) {
      where.status = query.status;
    } else {
      where.status = ProductStatus.ACTIVE;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.district && query.district.trim() !== "ALL") {
      where.sellerDistrict = {
        contains: query.district.trim(),
        mode: "insensitive",
      };
    }

    if (query.search && query.search.trim()) {
      const search = query.search.trim();
      where.OR = [
        { titleTa: { contains: search, mode: "insensitive" } },
        { titleEn: { contains: search, mode: "insensitive" } },
        { sellerName: { contains: search, mode: "insensitive" } },
        { descriptionTa: { contains: search, mode: "insensitive" } },
        { descriptionEn: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.marketProduct.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.marketProduct.count({ where }),
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
    const product = await this.prisma.marketProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(
        `Market product with ID "${id}" was not found.`,
      );
    }

    return product;
  }

  async updateStatus(id: string, status: ProductStatus) {
    await this.findById(id);

    const updated = await this.prisma.marketProduct.update({
      where: { id },
      data: { status },
    });

    this.logger.log(`Updated product ${id} status to ${status}`);
    return updated;
  }
}
