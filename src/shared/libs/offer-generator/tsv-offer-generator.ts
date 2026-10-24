import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import {generateRandomValue, getRandomBoolean, getRandomItem, getRandomItems} from '../../helpers/index.js';

const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 8;
const MIN_GUEST_COUNT = 1;
const MAX_GUEST_COUNT = 10;
const MIN_RENTAL_COST = 100;
const MAX_RENTAL_COST = 100000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities);
    const preview = getRandomItem<string>(this.mockData.previews);
    const photos = getRandomItems<string>(this.mockData.photos, 6).join(';');
    const accommodationType = getRandomItem<string>(this.mockData.accommodationTypes);
    const amenities = getRandomItems<string>(this.mockData.amenities).join(';');
    const author = [
      getRandomItem<string>(this.mockData.authors),
      getRandomItem<string>(this.mockData.emails),
      getRandomItem<string>(this.mockData.avatars),
      getRandomItem<string>(this.mockData.passwords),
      getRandomItem<string>(this.mockData.userTypes),
    ].join(';');
    const coordinates = getRandomItem<string>(this.mockData.coordinates);

    const isPremium = getRandomBoolean();
    const isFavourite = getRandomBoolean();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const roomsCount = generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);
    const guestsCount = generateRandomValue(MIN_GUEST_COUNT, MAX_GUEST_COUNT);
    const rentalCost = generateRandomValue(MIN_RENTAL_COST, MAX_RENTAL_COST);
    const commentsCount = generateRandomValue(0, 1000000);
    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();


    return [
      title, description, createdDate, city, preview, photos, isPremium, isFavourite, rating,
      accommodationType, roomsCount, guestsCount, rentalCost, amenities, author, commentsCount, coordinates
    ].join('\t');
  }
}
