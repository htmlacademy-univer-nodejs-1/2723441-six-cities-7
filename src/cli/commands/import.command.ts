import { Command } from './command.interface.js';
import {TSVFileReader} from '../../shared/libs/file-reader/index.js';
import chalk from 'chalk';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (err) {
      console.error(chalk.red.bold.underline(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${getErrorMessage(err)}`));
    }
  }
}
