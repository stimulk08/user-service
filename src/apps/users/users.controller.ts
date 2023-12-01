import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole, userRoles } from './entities/user.entity';
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiQuery({required: false, name: 'role', enum: userRoles})
  @ApiQuery({required: false, name: 'fromDate'})
  @ApiQuery({required: false, name: 'toDate'})
  @Get()
  findAll(
    @Query('role', new DefaultValuePipe(null)) role?: UserRole,
    @Query('fromDate', new DefaultValuePipe(0)) fromDate?: number,
    @Query('toDate', new DefaultValuePipe(0)) toDate?: number,
  ) {
    return this.usersService.filter(role, fromDate, toDate);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOneOrThrow(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
