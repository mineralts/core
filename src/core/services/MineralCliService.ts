import Collection from '../../api/utils/Collection'
import fs from 'fs'
import path from 'path'
import Help from '../../commands/Help'
import Ioc from '../../Ioc'
import { ForgeCommand } from '../../forge/entities/Command'
import Prompt from '../../forge/actions/Prompt'
import GenerateManifest from '../../commands/GenerateManifest'

interface CliCommands {
  'help': Help
  'generate:manifest': GenerateManifest
}

type CommandType<T> = T extends keyof CliCommands ? CliCommands[T] : any

export default class MineralCliService {
  public collection: Collection<keyof CliCommands | string, unknown> = new Collection()

  public registerCommand<T extends keyof CliCommands | string> (key: T, value: CommandType<T>): void {
    this.collection.set(key, value)
  }

  public resolveCommand<T extends keyof CliCommands | string> (key: T): CommandType<T> | undefined {
    return this.collection.get(key)
  }

  public async register () {
    const environment = Ioc.singleton().resolve('Mineral/Core/Environment')
    const console = Ioc.singleton().resolve('Mineral/Core/Console')
    const rcFile = environment!.resolveKey('RC_FILE')
    const root = environment!.resolveKey('APP_ROOT')

    const invalidLocation = rcFile!.commands.filter((location) => (
      location.startsWith('./') || location.startsWith('/')
    ))

    if (invalidLocation.length) {
      console.logger.fatal(new Error('The pre-loaded commands must be commands from npm packages.'))
    }

    const fetchCommandFiles = (files, logger, location) => {
      return Promise.all(
        files.map(async (file: string) => {
          if (file.endsWith('.d.ts')) {
            return
          }

          const { default: Command } = await import(path.join(location, file))
          const command = new Command() as ForgeCommand

          command.console = console
          command.ioc = Ioc.singleton()
          command.prompt = new Prompt()

          this.registerCommand(Command.commandName, command)
        })
      )
    }


    await Promise.all(
      rcFile!.commands.map(async (moduleName: string) => {
        const baseLocation = path.join(root!, 'node_modules', moduleName)
        const jsonPackageLocation = path.join(baseLocation, 'package.json')
        const JsonPackage = await import(jsonPackageLocation)

        const mineralSettings = JsonPackage['@mineralts']
        if (!mineralSettings) {
          return
        }

        return Promise.all(
          mineralSettings.commands?.map(async (dir: string) => {
            const location = path.join(baseLocation, dir)
            const files = await fs.promises.readdir(location)

            return fetchCommandFiles(files, console, location)
          })
        )
      })
    )
  }
}