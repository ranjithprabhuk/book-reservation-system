import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  isActive: boolean;
}
