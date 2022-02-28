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
import { join } from 'path'
import EventsListener from './EventsListener'
import fs from 'fs'
// import { Connector } from '@mineralts/connector-preview'
import Application from '../application/Application'
import PacketManager from '../core/packets/PacketManager'
import { MineralEvent } from '../core/entities/Event'
import { MineralProvider } from '../core/entities/Provider'
import Entity from '../core/entities/Entity'
import { MineralTask } from '../core/entities/tasks/Task'
import Scheduler from '../core/entities/tasks/Scheduler'
import { MineralContextMenu } from '../core/entities/ContextMenu'
import Packet from '../core/entities/Packet'
import Connector from '../connector/Connector'
import Shard from '../connector/shards/Shard'

export default class Assembler {
  public readonly eventListener: EventsListener = new EventsListener()
  public connector!: Connector

  constructor (public application: Application, private packetManager: PacketManager) {
  }

  public async build () {
    this.connector = new Connector(this.application, this.eventListener)
    this.connector.http.defineHeaders({
      Authorization: `Bot ${this.application.environment.cache.get('TOKEN')}`
    })

    await this.connector.websocketManager.connect()

    this.connector.websocketManager.shards.forEach((shard: Shard) => {
      shard.dispatch(async (payload) => {
        const packets: Packet[] | undefined = this.packetManager.resolve(payload.t)

        this.eventListener.emit('wss', payload)

        if (packets?.length) {
          await Promise.all(
            packets.map(async (packet: Packet) => (
              packet?.handle(this, payload.d)
            ))
          )
        }
      })
    })
  }

  public async register () {
    const files = await fetch(
      join(this.application.appRoot, 'src'),
      [this.application.mode === 'production' ? 'js' : 'ts'],
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
      this.application.container.providers.map(async (provider: MineralProvider) => {
        await provider.ok()
      })
    )
  }

  private async dispatch (path, item) {
    const identifiers = {
      event: () => this.registerEvent(path, item),
      scheduler: () => this.registerTask(path, item),
      contextmenu: () => this.registerContextMenu(path, item)
    }

    if (item && item.identifier in identifiers) {
      identifiers[item.identifier]()
      await Promise.all(
        this.application.container.providers.map(async (provider: MineralProvider) => {
          const entity = new Entity(item, path)
          await provider.loadFile(entity)
        })
      )
    }
  }

  protected registerEvent (path, item: { new (): MineralEvent, event: string }): void {
    const event = new item() as MineralEvent & { event: string }
    event.logger = this.application.logger
    event.client = this.application.client as any

    const eventContainer = this.application.container.events.get(item.event)

    if (!eventContainer) {
      const eventMap = new Map().set(path, event)
      this.application.container.events.set(item.event, eventMap)
    } else {
      eventContainer.set(path, event)
    }

    this.eventListener.on(item.event, async (...args: any[]) => {
      await event.run(...args)
    })
  }

  protected registerContextMenu (path, item: { new (): MineralContextMenu } & { permissions: any }): void {
    const menuContainer = this.application.container.menus
    const menu = new item() as MineralContextMenu & { name: string, permissions: any[] }

    menu.logger = this.application.logger
    menu.client = this.application.client as any

    menu.data = {
      permissions: item.permissions
    }

    if (menuContainer.get(menu.name)) {
      this.application.logger.fatal(`The ${menu.name} menu already exists, please choose another name`)
      return
    }

    menuContainer.set(menu.name, menu)
  }

  protected registerTask (path, item: { new (): MineralTask, id: string, cron: string }): void {
    const task = new item() as MineralTask

    const scheduler = new Scheduler(item.id, item.cron, task.run)
    scheduler.start()
  }

  public async registerProvider () {
    const files = await fetch(
      join(this.application.appRoot, 'src'),
      [this.application.mode === 'production' ? 'js' : 'ts'],
      'utf-8',
      ['node_modules', 'build', 'export']
    )

    for (const [, file] of files) {
      const content = await fs.promises.readFile(file.path, 'utf8')
      if (!content.startsWith('// mineral-ignore')) {
        const { default: item } = await import(file.path)
        if (item && item.identifier === 'provider') {
          const provider = new item() as MineralProvider
          provider.logger = this.application.logger
          provider.application = this.application

          this.application.container.providers.set(item.path, provider)
        }
      }
    }
  }
}