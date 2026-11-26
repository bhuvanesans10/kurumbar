import { Test, TestingModule } from "@nestjs/testing";
import { MarketService } from "./market.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { ProductCategory, ProductStatus } from "src/prisma/generated/enums";
import { CreateProductDto } from "./dto/create-product.dto";

describe("MarketService", () => {
  let service: MarketService;
  let prismaMock: {
    marketProduct: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };
  let module: TestingModule;

  const mockProduct = {
    id: "clprod123456789",
    titleTa: "நாட்டு குறும்பை செம்மறியாடுகள்",
    titleEn: "Pure Breed Kurumbai Sheep",
    category: ProductCategory.LIVESTOCK,
    price: 8500,
    unit: "ஒரு ஆடு",
    sellerName: "எஸ். மாரிமுத்து",
    sellerPhone: "9443212345",
    sellerDistrict: "ஈரோடு (Erode)",
    location: "அந்தியூர்",
    descriptionTa: "மேய்ச்சல் முறையில் வளர்க்கப்பட்ட ஆடுகள்",
    descriptionEn: "Naturally grazed healthy sheep",
    imageUrl: "https://example.com/sheep.jpg",
    isVerified: true,
    status: ProductStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaMock = {
      marketProduct: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    module = await Test.createTestingModule({
      providers: [
        MarketService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<MarketService>(MarketService);
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
    const createDto: CreateProductDto = {
      titleTa: "நாட்டு குறும்பை செம்மறியாடுகள்",
      titleEn: "Pure Breed Kurumbai Sheep",
      category: ProductCategory.LIVESTOCK,
      price: 8500,
      sellerName: "எஸ். மாரிமுத்து",
      sellerPhone: "9443212345",
      sellerDistrict: "Erode",
    };

    it("should create product with ACTIVE status", async () => {
      prismaMock.marketProduct.create.mockResolvedValue(mockProduct);

      const result = await service.create(createDto);

      expect(prismaMock.marketProduct.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            titleEn: "Pure Breed Kurumbai Sheep",
            price: 8500,
            status: ProductStatus.ACTIVE,
          }),
        }),
      );
      expect(result).toEqual(mockProduct);
    });

    it("should normalize empty strings to null", async () => {
      prismaMock.marketProduct.create.mockResolvedValue(mockProduct);

      await service.create({
        ...createDto,
        unit: "   ",
        location: "",
      });

      expect(prismaMock.marketProduct.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            unit: null,
            location: null,
          }),
        }),
      );
    });
  });

  describe("findAll", () => {
    it("should return paginated active products by default", async () => {
      prismaMock.marketProduct.findMany.mockResolvedValue([mockProduct]);
      prismaMock.marketProduct.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(prismaMock.marketProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: ProductStatus.ACTIVE,
          }),
        }),
      );
    });

    it("should filter by category, district, and search query", async () => {
      prismaMock.marketProduct.findMany.mockResolvedValue([mockProduct]);
      prismaMock.marketProduct.count.mockResolvedValue(1);

      await service.findAll({
        category: ProductCategory.LIVESTOCK,
        district: "Erode",
        search: "Sheep",
      });

      expect(prismaMock.marketProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: ProductCategory.LIVESTOCK,
            sellerDistrict: expect.objectContaining({ contains: "Erode" }),
            OR: expect.any(Array),
          }),
        }),
      );
    });
  });

  describe("findById", () => {
    it("should return product if found", async () => {
      prismaMock.marketProduct.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findById("clprod123456789");
      expect(result).toEqual(mockProduct);
    });

    it("should throw NotFoundException if product not found", async () => {
      prismaMock.marketProduct.findUnique.mockResolvedValue(null);

      await expect(service.findById("unknown-id")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("updateStatus", () => {
    it("should update product status successfully", async () => {
      prismaMock.marketProduct.findUnique.mockResolvedValue(mockProduct);
      prismaMock.marketProduct.update.mockResolvedValue({
        ...mockProduct,
        status: ProductStatus.SOLD,
      });

      const result = await service.updateStatus(
        "clprod123456789",
        ProductStatus.SOLD,
      );
      expect(result.status).toBe(ProductStatus.SOLD);
    });

    it("should throw NotFoundException if product to update not found", async () => {
      prismaMock.marketProduct.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus("unknown-id", ProductStatus.SOLD),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
