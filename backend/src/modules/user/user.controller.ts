import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/shared/dto/page-options.dto';
import { Auth } from 'src/shared/guards/roles.guard';
import { Role } from './entities/user.entity';

@Controller('user')
@ApiTags('User Management')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(true, false, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.findAll();
  }

  @Get('/search')
  @Auth(true, false, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  search(@Query() pageOptionsDto: PageOptionsDto) {
    return this.userService.search(pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(true, true, Role.USER)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(true, true, Role.USER)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('/access/:id')
  @HttpCode(HttpStatus.OK)
  @Auth(true, true, Role.ADMIN)
  updateAccess(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(true, true, Role.USER)
  remove(@Param('id') id: string) {
    return this.userService.inActivate(id);
  }
}
