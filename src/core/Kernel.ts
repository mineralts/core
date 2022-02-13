import { join } from 'node:path'
import fs from 'fs'
import PacketManager from './packets/PacketManager'
import Application from '../application/Application'
import Assembler from '../assembler/Assembler'
import { MineralProvider } from './entities/Provider'

export default class Kernel {
  public application: Application
  private readonly assembler: Assembler
  private readonly packetManager: PacketManager

  constructor (private projectDir: string) {
    const JSON_PACKAGE = this.loadFileSync(this.projectDir, 'package.json')
    const rcFile = this.loadFileSync(this.projectDir, '.mineralrc.json', 'The .mineralrc.json file was not found at the root of the project.')

    this.application = Application.create(this.projectDir, {
      appName: JSON_PACKAGE.name,
      version: JSON_PACKAGE.version,
      rcFile
    })

    this.packetManager = new PacketManager()
    this.assembler = new Assembler(this.application, this.packetManager)
    this.application.environment.cache.set('ROOT_PROJECT', this.projectDir)
    this.application.environment.registerEnvironment(this.projectDir)
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

  protected loadFileSync (location: string, filename: string, message?: string) {
    try {
      return JSON.parse(fs.readFileSync(join(location, filename), 'utf-8'))
    } catch (error) {
      throw new Error(
        message || `The file ${filename} at location ${location} was not found.`
      )
    }
  }
}