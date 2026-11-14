import {OfferService} from './offer-service.interface.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {City, Component, SortType} from '../../types/index.js';
import {inject} from 'inversify';
import {Logger} from '../../libs/logger/index.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT} from './offer.constant.js';

export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New category created: ${dto.title}`);
    return result;
  }

  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, {new: true})
      // .populate(['author'])
      .exec();
  }

  deleteById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(id)
      .exec();
  }

  findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(id)
      // .populate(['author'])
      .exec();
  }

  public async find(count? : number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    return this.offerModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(limit)
      .exec();
  }

  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city: city }, {}, {PREMIUM_OFFER_COUNT})
      .sort({ createdAt: SortType.Down })
      .exec();
  }

  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': { commentCount: 1, }}).exec();
  }

  updateRating(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, [
        { $set: {
          ratingsCount: { $add: [{ $ifNull: ['$ratingsCount', 0] }, 1] },
          ratingsSum: { $add: [{ $ifNull: ['$ratingsSum', 0] }, newRating] }
        }},
        {$set: { rating: { $round: [{ $divide: ['$ratingsSum', '$ratingsCount'] }, 1] } }}
      ],
      { updatePipeline: true, returnDocument: 'after' })
      .exec();
  }
}
