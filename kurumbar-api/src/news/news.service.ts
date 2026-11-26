import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { QueryNewsDto } from "./dto/query-news.dto";
import { Prisma } from "src/prisma/generated/client";

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNewsDto) {
    const article = await this.prisma.newsArticle.create({
      data: {
        titleTa: dto.titleTa.trim(),
        titleEn: dto.titleEn?.trim() || null,
        category: dto.category,
        summaryTa: dto.summaryTa.trim(),
        summaryEn: dto.summaryEn?.trim() || null,
        content: dto.content?.trim() || null,
        imageUrl: dto.imageUrl?.trim() || null,
        eventDate: dto.eventDate?.trim() || null,
        eventLocation: dto.eventLocation?.trim() || null,
        isPublished: dto.isPublished ?? true,
      },
    });

    this.logger.log(`Created news article: ${article.titleTa} (${article.id})`);
    return article;
  }

  async findAll(query: QueryNewsDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NewsArticleWhereInput = {};

    if (query.isPublished !== undefined) {
      where.isPublished = query.isPublished;
    } else {
      where.isPublished = true;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.search && query.search.trim()) {
      const search = query.search.trim();
      where.OR = [
        { titleTa: { contains: search, mode: "insensitive" } },
        { titleEn: { contains: search, mode: "insensitive" } },
        { summaryTa: { contains: search, mode: "insensitive" } },
        { summaryEn: { contains: search, mode: "insensitive" } },
        { eventLocation: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.newsArticle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.newsArticle.count({ where }),
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
    const article = await this.prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException(
        `News article with ID "${id}" was not found.`,
      );
    }

    return article;
  }
}
