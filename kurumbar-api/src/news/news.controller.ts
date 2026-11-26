import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { QueryNewsDto } from "./dto/query-news.dto";
import { Public } from "src/decorators/public.decorator";

@ApiTags("News")
@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Publish news or announcement (செய்திகள் / நிகழ்வுகள்)",
  })
  @ApiResponse({ status: 201, description: "News published successfully" })
  async create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "List published news and announcements" })
  async findAll(@Query() query: QueryNewsDto) {
    return this.newsService.findAll(query);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get news article by ID" })
  async findOne(@Param("id") id: string) {
    return this.newsService.findById(id);
  }
}
