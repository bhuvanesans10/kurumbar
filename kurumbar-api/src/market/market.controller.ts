import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MarketService } from "./market.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductStatusDto } from "./dto/update-product-status.dto";
import { QueryMarketDto } from "./dto/query-market.dto";
import { Public } from "src/decorators/public.decorator";

@ApiTags("Market")
@Controller("market")
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "List a product for sale (சந்தை பொருள் பதிவு)" })
  @ApiResponse({ status: 201, description: "Product listed successfully" })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.marketService.create(createProductDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Browse marketplace products with filters" })
  async findAll(@Query() query: QueryMarketDto) {
    return this.marketService.findAll(query);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get product details by ID" })
  async findOne(@Param("id") id: string) {
    return this.marketService.findById(id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update product status (Admin/Seller)" })
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateProductStatusDto,
  ) {
    return this.marketService.updateStatus(id, dto.status);
  }
}
