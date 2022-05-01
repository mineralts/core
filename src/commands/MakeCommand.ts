/*
 * packages/MakeCommand.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import path from 'path'
import { ForgeCommand } from '../forge/entities/Command'
import FileFactory from '../forge/FileFactory'

export default class MakeCommand extends ForgeCommand {
  public static commandName = 'make:command'
  public static description = 'Make a new command class'

  public static settings = {
    typescript: false,
    loadApp: false,
  }

  public async run (): Promise<void> {
    const generator = new FileFactory(this.console.logger)
    await generator.loadFolders(path.join(process.cwd(), 'src'))

    const filename = await this.prompt.ask('Please define a name for your file')
    const confirm = await this.prompt.confirm('Would you like to create a new folder ?')

    generator.setFilename(filename)

    if (confirm) {
      await this.createLocation(generator)
    } else {
      await this.useLocation(generator)
    }

    const templateLocation = path.join(__dirname, '..', '..', 'templates', 'command.txt')
    generator.setTemplate(templateLocation)

    await generator.write()
  }

  protected async createLocation (generator: FileFactory) {
    const location = await this.prompt.ask('Please define the location of your file', {
      placeholder: 'App/Folder/SubFolder'
    })

    generator.setLocation(location)
    await generator.buildFolders()
  }

  protected async useLocation (generator: FileFactory) {
    const choices = generator.getFolders().length ? generator.getFolders() : ['App']
    const location = await this.prompt.autoComplete('Please define the location of your order', choices)

    generator.setLocation(location)
  }
}