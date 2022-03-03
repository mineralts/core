import PacketManager from './packets/PacketManager'
import Application from '../application/Application'
import Assembler from '../assembler/Assembler'
import { MineralProvider } from './entities/Provider'

export default class Kernel {
  public application: Application
  private readonly assembler: Assembler
  private readonly packetManager: PacketManager

  constructor () {
    this.application = Application.create()
    this.application.setup()

    this.packetManager = new PacketManager()
    this.assembler = new Assembler(this.application, this.packetManager)
  }

  public async createApplication () {
    const providers = Application.singleton().resolveBinding('Mineral/Core/Providers')!
    const cli = Application.singleton().resolveBinding('Mineral/Core/Providers')

    await cli?.register()
    await providers.register()
    await this.assembler.build()

    Application.singleton().registerBinding('Mineral/Core/Http', this.assembler.connector.http)
    Application.singleton().registerBinding('Mineral/Core/Connector', this.assembler.connector)
    Application.singleton().registerBinding('Mineral/Core/Assembler', this.assembler)

    await Promise.all(
      providers.collection.map(async (provider: MineralProvider) => {
        await provider.boot()
      })
    )
  }
}