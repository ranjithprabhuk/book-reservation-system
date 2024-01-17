import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  password: string;
}
