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
  Post,
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

  @Post('/seed-user-data')
  @HttpCode(HttpStatus.OK)
  loadUserData() {
    return this.userService.loadUsers();
  }

  @Get('/search')
  @Auth(true, false, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  search(@Query() pageOptionsDto: PageOptionsDto) {
    return this.userService.search(pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.USER)
  findOne(@Param('id') id: string) {
    return this.userService.findUserReservations(id);
  }

  @Patch('/access/:id')
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.ADMIN)
  updateAccess(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.USER)
  remove(@Param('id') id: string) {
    return this.userService.inActivate(id);
  }
}
