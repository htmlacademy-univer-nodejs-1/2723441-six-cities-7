import {defaultClasses, getModelForClass, prop, modelOptions, Ref} from '@typegoose/typegoose';
import {Token, User, UserType, UserTypes} from '../../types/index.js';
import {createSHA256, generateSessionToken} from '../../helpers/index.js';
import {OfferEntity} from '../offer/index.js';

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, default: ''})
  public name: string;

  @prop({unique: true, required: true})
  public email: string;

  @prop({required: false, default: ''})
  public avatarPath: string;

  @prop({required: true, default: ''})
  public password: string;

  @prop({required: true, default: 'Standard', enum: UserTypes, type: () => String})
  public type?: UserType;

  @prop({
    ref: OfferEntity,
    required: false,
    default: []
  })
  public favouriteOffers: Ref<OfferEntity>[];

  @prop()
  public token?: Token;

  constructor(userData: User) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.password = '';
    this.token = undefined;
    this.type = userData.type;
    this.favouriteOffers = [];
  }

  public generateToken() {
    this.token = generateSessionToken();
    return this.token;
  }

  public removeToken() {
    this.token = undefined;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string): boolean {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
