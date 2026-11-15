import { UserType } from './user-type.type.js';
// import {Offer} from './offer.type.js';
import {Ref} from '@typegoose/typegoose';
import {OfferEntity} from '../modules/offer/index.js';

export type User = {
  name: string;
  email: string;
  avatarPath: string;
  password: string;
  type?: UserType;
  favouriteOffers?: Ref<OfferEntity>[];
}
