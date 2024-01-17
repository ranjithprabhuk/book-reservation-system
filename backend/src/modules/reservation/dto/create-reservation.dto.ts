import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  bookId: string;

  @ApiProperty()
  fromDate: Date;

  @ApiProperty()
  toDate: Date;
}
