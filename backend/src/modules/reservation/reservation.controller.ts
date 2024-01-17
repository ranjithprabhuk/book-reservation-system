import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/guards/roles.guard';
import { Role } from '../user/entities/user.entity';

@Controller('reservation')
@ApiTags('Reservation Management')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.USER)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.USER)
  findAllByUserId(@Param('userId') userId: string) {
    return this.reservationService.findAllByUserId(userId);
  }

  @Get('/book/:bookId')
  @HttpCode(HttpStatus.OK)
  @Auth(true, false, Role.USER)
  findAllByBookId(@Param('bookId') bookId: string) {
    return this.reservationService.findAllByUserId(bookId);
  }
}
