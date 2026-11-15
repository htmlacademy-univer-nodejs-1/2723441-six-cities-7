import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
// import {OfferService} from '../shared/modules/offer/index.js';
// import {UserService} from '../shared/modules/user/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    // @inject(Component.OfferService) private readonly offerService: OfferService,
    // @inject(Component.UserService) private readonly userService: UserService,
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database…');
    await this._initDb();
    this.logger.info('Init database completed');

    // const result = await this.offerService.findPremiumByCity('Brussels');
    // console.log(result);
    // 722632bfe89e1550f4d2c268f4ae7a3d5d8fcc2b8394a34e959b2b180d3aaacd
    // const a = await this.userService.login({email: 'aaa@ooo.com', password: '123456'});
    // const b = await this.userService.addFavourite({email: 'aaa@ooo.com', token: a}, '6af70c446328f688a64ad3bd');
    // const b = await this.userService.create({name: 'test', type: 'Standard', email: 'acjn@zc.com', password: 'qwerty', avatarPath: ''}, 'jcanksan');
    // const a = await this.userService.login({email: 'acjn@zc.com', password: 'qwerty'});
    // const b = await this.userService.getFavourites({email: 'acjn@zc.com', token: '75649ecc0ee18439767883b30db5eb6785759229b4f42c8ed4138ca8b2ea09d8'});
    // console.log(b);
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }
}
