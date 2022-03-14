/*
 * packages/Assembler.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { fetch } from 'fs-recursive'
import fs from 'node:fs'
import Application from '../application/Application'
import PacketManager from '../core/packets/PacketManager'
import { MineralProvider } from '../core/entities/Provider'
import Entity from '../core/entities/Entity'
import { MineralTask } from '../core/entities/tasks/Task'
import Scheduler from '../core/entities/tasks/Scheduler'
import Packet from '../core/entities/Packet'
import Connector from '../connector/Connector'
import Shard from '../connector/shards/Shard'

export default class Assembler {
  public connector!: Connector

  constructor (public application: Application, private packetManager: PacketManager) {
  }

  public async build () {
    const emitter = this.application.ioc.resolveBinding('Mineral/Core/Emitter')
    const environment = this.application.ioc.resolveBinding('Mineral/Core/Environment')

    this.connector = new Connector(this.application)
    this.connector.http.defineHeaders({
      Authorization: `Bot ${environment.resolveKey('TOKEN')}`
    })

    await this.connector.websocketManager.connect()

    this.connector.websocketManager.shards.forEach((shard: Shard) => {
      shard.dispatch(async (payload) => {
        const packets: Packet[] | undefined = this.packetManager.resolve(payload.t)

        emitter?.emit('wss', payload)

        if (packets?.length) {
          await Promise.all(
            packets.map(async (packet: Packet) => (
              packet?.handle(payload.d)
            ))
          )
        }
      })
    })
  }

  public async register () {
    const providers = this.application.ioc.resolveBinding('Mineral/Core/Providers')
    const environment = this.application.ioc.resolveBinding('Mineral/Core/Environment')

    const root = environment?.resolveKey('APP_ROOT')
    const mode = environment?.resolveKey('APP_MODE')

    const extensions = [mode === 'development' ? 'ts': 'js']

    const files = await fetch(
      root!,
      extensions,
      'utf-8',
      ['node_modules', 'build', 'export']
    )

    for (const [, file] of files) {
      const content = await fs.promises.readFile(file.path, 'utf8')
      if (!content.startsWith('// mineral-ignore')) {
        const { default: item } = await import(file.path)
        await this.dispatch(file.path, item)
      }
    }

    await Promise.all(
      providers!.collection.map(async (provider: MineralProvider) => {
        await provider.ok()
      })
    )
  }

  private async dispatch (path, item) {
    const events = this.application.ioc.resolveBinding('Mineral/Core/Events')
    const providers = this.application.ioc.resolveBinding('Mineral/Core/Providers')
    const contextMenus = this.application.ioc.resolveBinding('Mineral/Core/ContextMenus')

    const identifiers = {
      event: () => events?.register(path, item),
      scheduler: () => this.registerTask(path, item),
      contextmenu: () => contextMenus.register(path, item)
    }

    if (item && item.identifier in identifiers) {
      identifiers[item.identifier]()
    }

    await Promise.all(
      providers!.collection.map(async (provider: MineralProvider) => {
        const entity = new Entity(item, path)
        await provider.loadFile(entity)
      })
    )
  }


  protected registerTask (path, item: { new (): MineralTask, id: string, cron: string }): void {
    const task = new item() as MineralTask

    const scheduler = new Scheduler(item.id, item.cron, task.run)
    scheduler.start()
  }
}