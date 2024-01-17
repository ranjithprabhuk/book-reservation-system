import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  ISBN: string;
}
