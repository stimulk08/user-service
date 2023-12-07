import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, DefaultValuePipe, ParseArrayPipe, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRole, userRoles } from './entities/user-role.entity';
import { FilterQueryDto } from './dto/filter.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiQuery({required: false, name: 'roles', enum: userRoles, isArray: true, })
  @ApiQuery({required: false, name: 'fromDate'})
  @ApiQuery({required: false, name: 'toDate'})
  @Get()
  findAll(
    @Query() dto: FilterQueryDto
  ) {
    console.log(dto);
    
    return this.usersService.filter(
      (dto.roles as never as UserRole[])?.filter(r => !!r) ?? [], 
      dto.fromDate,
      dto.toDate
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOneOrThrow(id);
  }

  @HttpCode(204)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @Delete()
  drop() {
    return this.usersService.dropDb();
  }
}
