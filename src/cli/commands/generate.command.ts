import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import got from 'got';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import chalk from 'chalk';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';

export class GenerateCommand implements Command {
  private initialData!: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);
    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was ${chalk.underline.bold(`${chalk.red('C')}${chalk.redBright('R')}${chalk.yellow('E')}${chalk.green('A')}${chalk.blue('T')}${chalk.cyan('E')}${chalk.magenta('D!')}`)}`);
    } catch (error: unknown) {
      console.error(chalk.red.bold('Can\'t generate data'));
      console.error(getErrorMessage(error));
    }
  }
}
