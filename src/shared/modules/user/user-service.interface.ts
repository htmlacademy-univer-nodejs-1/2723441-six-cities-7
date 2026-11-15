import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import {LoginUserDto} from './dto/login-user.dto.js';
import {Token} from '../../types/index.js';
import {OfferEntity} from '../offer/index.js';
import {AuthorizedUserDto} from './dto/authorized-user.dto.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  login(dto: LoginUserDto, salt: string): Promise<Token>;
  logout(dto: AuthorizedUserDto): Promise<void>;
  checkState(dto: AuthorizedUserDto): Promise<DocumentType<UserEntity> | null>;
  getFavourites(dto: AuthorizedUserDto): Promise<DocumentType<OfferEntity>[]>;
  addFavourite(dto: AuthorizedUserDto, offerId: string): Promise<DocumentType<UserEntity> | null>;
  deleteFavourite(dto: AuthorizedUserDto, offerId: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
}
