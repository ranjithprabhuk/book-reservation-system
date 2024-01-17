import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  password: string;
}
