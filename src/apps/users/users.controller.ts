import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { userRoles } from './entities/user-role.entity';
import { FilterQueryDto } from './dto/filter.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBadRequestResponse({ description: 'Invalid data to create' })
  @ApiCreatedResponse({ type: User })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Filter users by roles, creation date' })
  @ApiOkResponse({type: User, isArray: true})
  @ApiBadRequestResponse({ description: 'Invalid dates/role'})
  @ApiQuery({required: false, name: 'roles', enum: userRoles, isArray: true, })
  @ApiQuery({required: false, name: 'fromDate'})
  @ApiQuery({required: false, name: 'toDate'})
  @Get()
  async findAll(
    @Query() dto: FilterQueryDto
  ) {
    let roles = dto.roles ?? [];
    roles = Array.isArray(roles) ? roles : [roles];
    return this.usersService.filter(
      roles.filter(r => !!r), 
      dto.fromDate,
      dto.toDate
    );
  }


  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({type: User})
  @ApiBadRequestResponse({ description: 'User not found / Invalid id' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOneOrThrow(id);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiBadRequestResponse({ description: 'User not found / Invalid data' })
  @HttpCode(204)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Remove user by id' })
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'Drop database' })
  @Delete()
  drop() {
    return this.usersService.dropDb();
  }
}
