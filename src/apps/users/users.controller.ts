import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, DefaultValuePipe, ParseArrayPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UserRole, userRoles } from './entities/user-role.entity';

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
    @Query('roles', new DefaultValuePipe(""), new ParseArrayPipe({separator: ',', optional: true})) roles: any,
    @Query('fromDate', new DefaultValuePipe(0)) fromDate: number,
    @Query('toDate', new DefaultValuePipe(0)) toDate: number,
  ) {
    console.log(roles, fromDate, toDate);
    roles = roles.filter(role => !!role) as never as UserRole[];
    return this.usersService.filter(roles as never as UserRole[], fromDate, toDate);
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
