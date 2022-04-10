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
import { ForgeCommand } from '../forge/entities/Command'
import Collection from '../api/utils/Collection'
import { MineralEvent } from '../core/entities/Event'

export default class MakeCommand extends ForgeCommand {
  public static commandName = 'info'
  public static description = 'Displays the current information about your project'

  public static settings = {
    loadApp: true
  }

  public async run (): Promise<void> {
    const environment = this.ioc.resolve('Mineral/Core/Environment')
    const cli = this.ioc.resolve('Mineral/Core/Cli')
    const commands = this.ioc.resolve('Mineral/Core/Commands')
    const events = this.ioc.resolve('Mineral/Core/Events')

    const result = {
      node_version: process.version,
      os: {
        arch: os.arch(),
        version: os.version(),
        platform: os.platform(),
        type: os.type()
      },
      appName: environment?.resolveKey('APP_NAME'),
      appVersion: environment?.resolveKey('APP_VERSION'),
      intents: environment?.resolveKey('INTENTS'),
      dependencies: environment?.resolveKey('MINERAL_DEPENDENCIES'),
      rcFile: environment?.resolveKey('RC_FILE'),
      cli: cli?.collection,
      commands: commands?.collection,
      events: events?.collection.map((events: Collection<string, MineralEvent>, identifier: string) => ({
        identifier,
        events: events.map((event, location: string) => ({
          location,
          event
        }))
      }))
    }

    console.debug(result)
  }
}