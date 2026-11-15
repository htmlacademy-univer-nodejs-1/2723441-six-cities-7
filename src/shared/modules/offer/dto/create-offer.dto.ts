import {AccommodationType, Amenity, City, Coordinates, User} from '../../../types/index.js';

export type CreateOfferDto = {
  title: string;
  description: string;
  publishDate: Date;
  city?: City;
  preview: string;
  photos: string[];
  isPremium: boolean;
  rating: number;
  accommodationType?: AccommodationType;
  roomsCount: number;
  guestsCount: number;
  rentalCost: number;
  amenities?: Amenity[];
  author: User;
  coordinates: Coordinates;
}
