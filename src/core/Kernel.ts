import PacketManager from './packets/PacketManager'
import Application from '../application/Application'
import Assembler from '../assembler/Assembler'
import { MineralProvider } from './entities/Provider'
import { fetch } from 'fs-recursive'
import fs from 'node:fs'
import Entity from './entities/Entity'
import { join } from 'node:path'
import ModuleAlias from 'module-alias'

export default class Kernel {
  public application: Application
  private readonly assembler: Assembler
  private readonly packetManager: PacketManager

  constructor () {
    this.application = Application.create()
    this.application.setup()

    this.packetManager = new PacketManager()
    this.assembler = new Assembler(this.application, this.packetManager)

    const environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
    Object.entries(environment.resolveKey('RC_FILE')!.aliases).forEach(([key, value]) => {
      console.log(key, join(process.cwd(), value))
      ModuleAlias.addAlias(key, join(process.cwd(), value))
    })
  }

  public async createApplication () {
    const providers = Application.singleton().resolveBinding('Mineral/Core/Providers')
    const cli = Application.singleton().resolveBinding('Mineral/Core/Providers')

    await Promise.all([
      cli?.register(),
      providers.register()
    ])

    await this.assembler.build()

    Application.singleton().registerBinding('Mineral/Core/Http', this.assembler.connector.http)
    Application.singleton().registerBinding('Mineral/Core/Connector', this.assembler.connector)
    Application.singleton().registerBinding('Mineral/Core/Assembler', this.assembler)

    await this.bootProviders()
  }

  public disposeKernel () {
    Application.singleton().registerBinding('Mineral/Core/kernel', this)
  }

  public async createCliApplication () {
    const cli = Application.singleton().resolveBinding('Mineral/Core/Cli')
    const providers = Application.singleton().resolveBinding('Mineral/Core/Providers')
    await providers.register()
    await cli?.register()
  }

  public async bootProviders () {
    const providers = Application.singleton().resolveBinding('Mineral/Core/Providers')
    const environment = this.application.ioc.resolveBinding('Mineral/Core/Environment')
    await Promise.all(
      providers.collection.map(async (provider: MineralProvider) => {
        await provider.boot()
      })
    )

    const root = environment?.resolveKey('APP_ROOT')
    const mode = environment?.resolveKey('APP_MODE')

    const extensions = [mode === 'development' ? 'ts' : 'js']

    const files = await fetch(
      root!,
      extensions,
      'utf-8',
      ['node_modules', 'build', 'export']
    )

    for (const [, file] of files) {
      const content = await fs.promises.readFile(file.path, 'utf8')
      if (!content.startsWith('// mineral-ignore')) {
        try {
          const { default: item } = await import(file.path)
          await Promise.all(
            providers!.collection.map(async (provider: MineralProvider) => {
              const entity = new Entity(item, file.path)
              await provider.loadFile(entity)
            })
          )
        } catch (e) {
        }
      }
    }
  }
}