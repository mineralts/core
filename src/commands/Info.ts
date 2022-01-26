/*
 * packages/MakeCommand.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import os from 'os'
import path from 'path'
import { Command } from '../forge/entities/Command'

export default class MakeCommand extends Command {
  public static commandName = 'info'
  public static description = 'Displays the current information about your project'

  public static settings = {
    loadApp: true
  }

  public async run (): Promise<void> {
    const jsonPackage = await import(path.join(process.cwd(), 'package.json'))

    const result = {
      node_version: process.version,
      os: {
        arch: os.arch(),
        version: os.version(),
        platform: os.platform(),
        type: os.type()
      },
      appName: jsonPackage.name,
      appVersion: jsonPackage.version,
      appIntents: this.application.intents,
      packages: {},
      rcFile: this.application.rcFile,
      commands: this.application.commands
    }

    Object.entries(jsonPackage.dependencies).forEach(([key, version]) => {
      if (key.startsWith('@mineralts')) {
        result.packages[key] = version
      }
    })

    console.debug(result)
  }
}