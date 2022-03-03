import Collection from '../../api/utils/Collection'
import fs from 'fs'
import path from 'path'
import Help from '../../commands/Help'
import Application from '../../application/Application'

interface CliCommands {
  'Mineral/Help': Help
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
    const environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
    const logger = Application.singleton().resolveBinding('Mineral/Core/Logger')
    const rcFile = environment!.resolveKey('rcFile')

    const invalidLocation = rcFile!.commands.filter((location) => (
      location.startsWith('./') || location.startsWith('/')
    ))

    if (invalidLocation.length) {
      logger?.fatal('The pre-loaded commands must be commands from npm packages.')
    }

    const fetchCommandFiles = (files, logger, location) => {
      return Promise.all(
        files.map(async (file: string) => {
          if (file.endsWith('.d.ts')) {
            return
          }

          const { default: Command } = await import(path.join(location, file))
          const command = new Command()

          command.logger = logger
          command.ioc = Application.singleton()

          this.registerCommand(Command.commandName, command)
        })
      )
    }


    await Promise.all(
      rcFile!.commands.map(async () => {
        const baseLocation = path.join(__dirname, '..', '..', '..')
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

            return fetchCommandFiles(files, logger, location)
          })
        )
      })
    )
  }
}