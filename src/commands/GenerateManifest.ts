/*
 * packages/GenerateManifest.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import fs from 'fs'
import path from 'path'
import { ForgeCommand } from '../forge/entities/Command'

export default class GenerateManifest extends ForgeCommand {
  public static commandName = 'generate:manifest'
  public static description = 'Generate manifest file'

  public static settings = {
    typescript: true,
    loadApp: true,
  }

  public async run (...args): Promise<void> {
    let [withLogger] = args

    if (withLogger === undefined) {
      withLogger = true
    }

    if (withLogger) {
      this.console.logger.info('Waiting to generate manifest file...')
    }

    const environment = this.ioc.resolve('Mineral/Core/Environment')
    const commandDirs = environment?.resolveKey('RC_FILE')?.commands

    if (!commandDirs) {
      return
    }

    const commands = await this.getCommands(commandDirs)
    const manifest = this.syncManifest(commands)
    await this.writeManifest(manifest)

    if (withLogger) {
      this.console.logger.info('Manifest was create in the root folder.')
    }
  }

  public async getCommands (commandDirs: string[]) {
    return Promise.all(
      commandDirs.map(async (dir: string) => {
        const commandDirs: string[] = []

        if (dir.startsWith('./')) {
          commandDirs.push(path.join(process.cwd(), dir))
        } else {
          const packageLocation = path.join(process.cwd(), 'node_modules', ...dir.split('/'))
          const jsonPackageLocation = path.join(packageLocation, 'package.json')
          const JsonPackage = await import(jsonPackageLocation)
          JsonPackage['@mineralts'].commands.forEach((dir) => {
            commandDirs.push(path.join(packageLocation, dir))
          })
        }

        const commands = await Promise.all(
          commandDirs.map(async (dir: string) => {
            const files = await fs.promises.readdir(dir)
            return files.map((file: string) => {
              return path.join(dir, file)
            })
          })
        )

        return Promise.all(
          commands.flat().map(async (file) => {
            if (!file.endsWith('.d.ts')) {
              const { default: Command } = await import(file)
              return { command: Command, path: file }
            }
          })
        )
      })
    )
  }

  public syncManifest (commands: any[]) {
    return {
      commands: commands.flat().filter((command) => command).map((item) => ({
        commandName: item!.command.commandName,
        description: item!.command.description,
        settings: item!.command.settings,
        path: item!.path
          .replace(process.cwd(), '')
          .replace('\\node_modules\\', '')
          .replace(/\\/g, '/')
      }))
    }
  }

  public async writeManifest (manifest) {
    await fs.promises.writeFile(
      path.join(process.cwd(), 'forge-manifest.json'),
      JSON.stringify(manifest, null, 2)
    )
  }
}