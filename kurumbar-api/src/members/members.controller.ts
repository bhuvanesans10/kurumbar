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
import { MembersService } from "./members.service";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberStatusDto } from "./dto/update-member-status.dto";
import { QueryMembersDto } from "./dto/query-members.dto";
import { Public } from "src/decorators/public.decorator";

@ApiTags("Members")
@Controller("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new member (உறுப்பினர் சேர்க்கை)" })
  @ApiResponse({ status: 201, description: "Member registered successfully" })
  async create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: "List member applications with search & filter" })
  async findAll(@Query() query: QueryMembersDto) {
    return this.membersService.findAll(query);
  }

  @Get("verify/:membershipId")
  @Public()
  @ApiOperation({ summary: "Verify member identity by membership ID" })
  async verify(@Param("membershipId") membershipId: string) {
    return this.membersService.findByMembershipId(membershipId);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get member details by database ID" })
  async findOne(@Param("id") id: string) {
    return this.membersService.findById(id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Approve or reject member registration" })
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateMemberStatusDto,
  ) {
    return this.membersService.updateStatus(id, dto.status);
  }
}
