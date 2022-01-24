/*
 * packages/MakeCommand.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { Command } from '../forge/entities/Command'
import path from 'path'
import { prompt } from 'enquirer'
import { fetch, File } from 'fs-recursive'
import { MineralCommand } from '../core/entities/Command'
import FileFactory from '../forge/FileFactory'

export default class MakeSubcommand extends Command {
  public static commandName = 'make:subcommand'
  public static description = 'Make a new subcommand class'

  public static settings = {
    loadApp: true
  }

  public async run (): Promise<void> {
    const generator = new FileFactory(this.logger)
    await generator.loadFolders(path.join(process.cwd(), 'src'))

    this.logger.info('The subcommand support guest is being launched...')

    const files = await fetch(
      path.join(process.cwd(), 'src'),
      ['ts'],
      'utf-8'
    )

    const confirm = {
      type: 'confirm',
      name: 'confirm',
      message: 'Would you like to create a new folder ?',
    }

    const filename = {
      type: 'input',
      name: 'filename',
      message: 'Please define a name for your file'
    }

    const arr: (MineralCommand & { data: { label: string } }) [] = []
    await Promise.all(
      Array.from(files).map(async ([, file]: [string, File]) => {
        const { default: Entity } = await import(file.path)

        if (Entity.identifier === 'slash-command') {
          arr.push(new Entity())
        }
      })
    )

    const parent = {
      type: 'autocomplete',
      name: 'parent',
      message: 'Please define the parent command',
      limit: 3,
      choices: arr.map((command) => this.application.helper.capitalCase(command.data.label))
    }

    try {
      const answers = await prompt([filename, parent, confirm]) as { filename, parent, confirm }
      generator.setFilename(answers.filename)

      answers.confirm
        ? await this.createLocation(generator)
        : await this.useLocation(generator)

      const templateLocation = path.join(__dirname, '..', '..', 'templates', 'subcommand.txt')
      generator.setTemplate(templateLocation, (content: string) => {
        return content.replaceAll('$parent', answers.parent.toLowerCase())
      })

      await generator.write()
    } catch (err) {
      this.logger.error('Order has been cancelled.')
    }
  }

  protected async createLocation (generator: FileFactory) {
    const location = {
      type: 'input',
      name: 'location',
      message: 'Please define the location of your file',
      hint: 'App/Folder/SubFolder'
    }

    try {
      const answer = await prompt([location]) as { location: string }
      generator.setLocation(answer.location)

      await generator.buildFolders()
    } catch (err) {
      this.logger.error('Order has been cancelled.')
    }
  }

  protected async useLocation (generator: FileFactory) {
    const location = {
      type: 'autocomplete',
      name: 'location',
      message: 'Please define the location of your order',
      limit: 3,
      choices: generator.getFolders().length ? generator.getFolders() : ['App']
    }

    try {
      const answer = await prompt([location]) as { location: string }
      generator.setLocation(answer.location)
    } catch (err) {
      this.logger.error('Order has been cancelled.')
    }
  }
}