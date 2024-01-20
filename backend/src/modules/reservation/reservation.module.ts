import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { JwtService } from '@nestjs/jwt';
import { BookModule } from '../book/book.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Reservation]),
    BookModule,
    UserModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService, JwtService],
})
export class ReservationModule {}
