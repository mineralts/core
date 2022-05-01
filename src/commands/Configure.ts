/*
 * packages/MakeCommand.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { ForgeCommand } from '../forge/entities/Command'
import Ioc from '../Ioc'
import { join } from 'node:path'
import fs from 'node:fs'
import { MineralModule } from '../core/entities/Module'
import Prompt from '../forge/actions/Prompt'

export default class Configure extends ForgeCommand {
  public static commandName = 'configure'
  public static description = 'Configure installed mineral package'

  public static settings = {
    typescript: true
  }

  public async run (...args: string[]): Promise<void> {
    const [moduleName] = args
    const packageLocation = join(process.cwd(), 'node_modules', moduleName)

    if (!fs.existsSync(packageLocation)) {
      this.console.logger.error(`Module ${moduleName} not found.`)
      process.exit(0)
    }

    const jsonPackage = await import(join(packageLocation, 'package.json'))
    const provider = join(packageLocation, jsonPackage['@mineralts']['instruction'])
    const { default: Instruction } = await import(provider)

    const instruction = new Instruction() as MineralModule
    instruction.console = this.console
    instruction.ioc = Ioc.singleton()
    instruction.prompt = new Prompt()

    await instruction.configure()
  }
}