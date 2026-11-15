import {defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import {AccommodationType, AccommodationTypes, Amenity, Cities, City, Coordinates, User} from '../../types/index.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})

export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, default: '' })
  public title!: string;

  @prop({ required: true, default: '' })
  public description!: string;

  @prop({ required: true })
  public publishDate!: Date;

  @prop({ required: true, enum: Cities, type: () => String })
  public city?: City;

  @prop({ required: true, default: '' })
  public preview!: string;

  @prop({ required: true, default: [] })
  public photos!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: 5 })
  public rating!: number;

  @prop({ required: true, enum: AccommodationTypes, type: () => String })
  public accommodationType?: AccommodationType;

  @prop({ required: true, default: 1 })
  public roomsCount!: number;

  @prop({ required: true, default: 1 })
  public guestsCount!: number;

  @prop({ required: true, default: 100 })
  public rentalCost!: number;

  @prop({ required: true })
  public amenities?: Amenity[];

  @prop({ required: true })
  public author!: User;

  @prop({ required: false, default: 0 })
  public commentsCount!: number;

  @prop({ required: true })
  public coordinates!: Coordinates;

  @prop({ required: false, default: 0 })
  public ratingsCount?: number;

  @prop({ required: false, default: 0 })
  public ratingsSum?: number;
}

export const OfferModel = getModelForClass(OfferEntity);
