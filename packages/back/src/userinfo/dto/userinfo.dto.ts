import { PartialType } from '@nestjs/mapped-types';

export class UserLoginDto {
  password: string;
  phone: string;
}
export class CreateUserinfoDto {
  username: string;
  password: string;
  avator: string;
  phone: string;
}

export class UpdateUserinfoDto extends PartialType(CreateUserinfoDto) {}
