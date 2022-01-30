import { join } from 'path'
import fs from 'fs'
import PacketManager from './packets/PacketManager'
import Application from '../application/Application'
import Assembler from '../assembler/Assembler'
import { MineralProvider } from './entities/Provider'

export default class Kernel {
  public application: Application
  private readonly assembler: Assembler
  private readonly packetManager: PacketManager

  constructor () {
    const JSON_PACKAGE = this.loadFile(join(process.cwd(), 'package.json'))
    const rcFile = this.loadRcFile()

    this.application = Application.create(process.cwd(), {
      appName: JSON_PACKAGE.name,
      version: JSON_PACKAGE.version,
      rcFile,
    })

    this.packetManager = new PacketManager()

    this.assembler = new Assembler(this.application, this.packetManager)
    this.application.environment.registerEnvironment()
  }

  public async createApplication () {
    await this.application.registerCliCommands()
    await this.assembler.build()
    await this.assembler.registerProvider()

    this.application.registerBinding('request', this.assembler.connector.http)
    await Promise.all(
      this.application.container.providers.map(async (provider: MineralProvider) => {
        await provider.boot()
      })
    )
  }


  protected loadRcFile () {
    try {
      const path = join(process.cwd(), '.mineralrc.json')
      return JSON.parse(fs.readFileSync(path, 'utf-8'))
    } catch (error) {
      throw new Error('Mineral expects ".mineralrc.json" file to exist in the application root')
    }
  }

  protected loadFile (filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  }
}