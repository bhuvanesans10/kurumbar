import { Test, TestingModule } from "@nestjs/testing";
import { NewsService } from "./news.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { NewsCategory } from "src/prisma/generated/enums";
import { CreateNewsDto } from "./dto/create-news.dto";

describe("NewsService", () => {
  let service: NewsService;
  let prismaMock: {
    newsArticle: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
    };
  };
  let module: TestingModule;

  const mockArticle = {
    id: "clnews123456789",
    titleTa: "ஸ்ரீ பீரேஸ்வர சுவாமி மகா கும்பாபிஷேக விழா",
    titleEn: "Sri Beereswarar Maha Kumbabishekam",
    category: NewsCategory.FESTIVAL,
    summaryTa: "நமது சமூக குலதெய்வ திருத்தலத்தில் கும்பாபிஷேக திருவிழா",
    summaryEn: "Grand temple festival invitation",
    content: "சேலம் மாவட்டம் மேச்சேரி அருள்மிகு ஸ்ரீ பீரேஸ்வர சுவாமி திருத்தலம்",
    imageUrl: "https://example.com/temple.jpg",
    eventDate: "12 மார்ச் 2026",
    eventLocation: "மேச்சேரி, சேலம்",
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaMock = {
      newsArticle: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
    };

    module = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
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
    const createDto: CreateNewsDto = {
      titleTa: "ஸ்ரீ பீரேஸ்வர சுவாமி மகா கும்பாபிஷேக விழா",
      titleEn: "Sri Beereswarar Maha Kumbabishekam",
      category: NewsCategory.FESTIVAL,
      summaryTa: "நமது சமூக குலதெய்வ திருத்தலத்தில் கும்பாபிஷேக திருவிழா",
    };

    it("should create a news article successfully", async () => {
      prismaMock.newsArticle.create.mockResolvedValue(mockArticle);

      const result = await service.create(createDto);

      expect(prismaMock.newsArticle.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            titleTa: "ஸ்ரீ பீரேஸ்வர சுவாமி மகா கும்பாபிஷேக விழா",
            category: NewsCategory.FESTIVAL,
            isPublished: true,
          }),
        }),
      );
      expect(result).toEqual(mockArticle);
    });

    it("should normalize empty strings and trim whitespace to null", async () => {
      prismaMock.newsArticle.create.mockResolvedValue(mockArticle);

      await service.create({
        ...createDto,
        content: "   ",
        eventDate: "",
      });

      expect(prismaMock.newsArticle.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            content: null,
            eventDate: null,
          }),
        }),
      );
    });
  });

  describe("findAll", () => {
    it("should return published news articles by default", async () => {
      prismaMock.newsArticle.findMany.mockResolvedValue([mockArticle]);
      prismaMock.newsArticle.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(prismaMock.newsArticle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isPublished: true,
          }),
        }),
      );
    });

    it("should filter by category and search query", async () => {
      prismaMock.newsArticle.findMany.mockResolvedValue([mockArticle]);
      prismaMock.newsArticle.count.mockResolvedValue(1);

      await service.findAll({
        category: NewsCategory.FESTIVAL,
        search: "கும்பாபிஷேக",
      });

      expect(prismaMock.newsArticle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: NewsCategory.FESTIVAL,
            OR: expect.any(Array),
          }),
        }),
      );
    });
  });

  describe("findById", () => {
    it("should return article if found", async () => {
      prismaMock.newsArticle.findUnique.mockResolvedValue(mockArticle);

      const result = await service.findById("clnews123456789");
      expect(result).toEqual(mockArticle);
    });

    it("should throw NotFoundException if article not found", async () => {
      prismaMock.newsArticle.findUnique.mockResolvedValue(null);

      await expect(service.findById("unknown-id")).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
