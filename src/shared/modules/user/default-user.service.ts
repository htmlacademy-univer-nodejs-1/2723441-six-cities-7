import { UserService } from './user-service.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { inject, injectable } from 'inversify';
import { Component, Token} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {LoginUserDto} from './dto/login-user.dto.js';
import { OfferEntity } from '../offer/index.js';
import {AuthorizedUserDto} from './dto/authorized-user.dto.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {
  }

  public async addFavourite(dto: AuthorizedUserDto, offerId: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .exec();

    if (!user) {
      return Promise.reject(new Error('Пользователь с таким email не найден'));
    }
    if (dto.token !== user.token) {
      return Promise.reject(new Error(`Пользователь не авторизован\n${dto.token}\n${user.token}`));
    }

    return this.userModel.findByIdAndUpdate(
      user.id,
      { $addToSet: { favouriteOffers: offerId } },
      { returnDocument: 'after' });
  }

  public async deleteFavourite(dto: AuthorizedUserDto, offerId: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .exec();

    if (!user) {
      return Promise.reject(new Error('Пользователь с таким email не найден'));
    }
    if (dto.token !== user.token) {
      return Promise.reject(new Error('Пользователь не авторизован'));
    }

    return this.userModel.findByIdAndUpdate(
      user.id,
      { $pull: { favouriteOffers: offerId } },
      { returnDocument: 'after' });
  }

  public async getFavourites(dto: AuthorizedUserDto): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .populate<{ favouriteOffers: DocumentType<OfferEntity>[] }>('favouriteOffers')
      .exec();

    if (!user) {
      return Promise.reject(new Error('Пользователь с таким email не найден'));
    }
    if (dto.token !== user.token) {
      return Promise.reject(new Error('Пользователь не авторизован'));
    }

    return user.favouriteOffers;
  }

  public async login(dto: LoginUserDto, salt: string): Promise<Token> {
    const user = await this.findByEmail(dto.email);
    if (!user || !user.verifyPassword(dto.password, salt)) {
      return Promise.reject(new Error('Неверный логин или пароль'));
    }
    const token = user.generateToken();
    await user.save();
    return token;
  }

  public async logout(dto: AuthorizedUserDto): Promise<void> {
    const user = await this.findByEmail(dto.email);
    if (!user) {
      return Promise.reject(new Error('Пользователь с таким email не найден'));
    }
    if (dto.token !== user.token) {
      return Promise.reject(new Error('Пользователь не авторизован'));
    }
    user.removeToken();
  }

  public async checkState(dto: AuthorizedUserDto): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);
    if (!user) {
      return Promise.reject(new Error('Пользователь с таким email не найден'));
    }
    if (dto.token !== user.token) {
      return Promise.reject(new Error('Пользователь не авторизован'));
    }
    return this.userModel
      .findOne({ email: dto.email})
      .select('-password')
      .exec();
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = await this.findByEmail(dto.email);
    if (user) {
      return Promise.reject('Пользователь с таким email уже существует');
    }

    const newUser = new UserEntity(dto);
    newUser.setPassword(dto.password, salt);

    const result = await this.userModel.create(newUser);
    this.logger.info(`New user created: ${newUser.email}`);

    return result;
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({id});
  }
}
