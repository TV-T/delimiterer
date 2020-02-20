import {Command, flags} from '@oclif/command'
import * as clipboardy from 'clipboardy'
import * as os from 'os'

class Delimiterer extends Command {
  static description = 'A terminal tool for delimiting text';

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    output: flags.boolean({char: 'o'}),
  };

  static args = [
    {
      name: 'inputDelimiter',
      required: false,
      description: 'The delimiter to split the input with.',
      default: 'newline',
      parse: (input: string): string => {
        switch (input) {
        case 'space':
          return ' '
        default:
          return input
        }
      },
    },
    {
      name: 'outputDelimiter',
      required: false,
      description: 'The delimiter used to rejoin the split input.',
      default: ',',
      parse: (input: string): string => {
        switch (input) {
        case 'space':
          return ' '
        case 'newline':
          return os.EOL
        default:
          return input
        }
      },
    },
  ];

  async run() {
    try {
      const {args, flags} = this.parse(Delimiterer)
      const inputDelimiter = args.inputDelimiter === 'newline' ?
        /\r\n|\r|\n/g :
        args.inputDelimiter

      const outputFunc = flags.output ? this.log : clipboardy.write
      await outputFunc(
        await clipboardy.read()
        .then(input => input ? input.split(inputDelimiter) : Promise.reject(new Error('Clipboard is empty.')))
        .then(splitInput => splitInput.join(args.outputDelimiter)),
      )
      if (!flags.output) {
        this.log('Modified clipboard content.')
      }
    } catch (error) {
      this.error(error, {exit: 100})
    }
  }
}

export = Delimiterer;
