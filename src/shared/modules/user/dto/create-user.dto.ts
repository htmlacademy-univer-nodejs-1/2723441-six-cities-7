import {UserType} from '../../../types/index.js';

export type CreateUserDto = {
  name: string;
  email: string;
  avatarPath: string;
  password: string;
  type?: UserType;
}
