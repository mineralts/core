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
import { Connector } from '@mineralts/connector-preview'
import Application from '../application/Application'
import PacketManager from '../core/packets/PacketManager'
import { MineralEvent } from '../core/entities/Event'
import { MineralCommand } from '../core/entities/Command'
import { MineralProvider } from '../core/entities/Provider'
import Entity from '../core/entities/Entity'

export default class Assembler {
  public readonly eventListener: EventsListener = new EventsListener()
  public connector!: Connector

  constructor (public application: Application, private packetManager: PacketManager) {
  }

  public async build () {
    this.connector = new Connector(this.application)
    this.connector.http.defineHeaders({ Authorization: `Bot ${this.application.environment.cache.get('TOKEN')}` })

    await this.connector.socket.connect()
    this.connector.socket.dispatch(async (payload) => {
      const packets = this.packetManager.resolve(payload.t)

      if (packets?.length) {
        await Promise.all(
          packets.map(async (packet) => (
            packet?.handle(this, payload.d)
          ))
        )
      }
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
      'slash-command': () => this.registerCommand(path, item),
      'subcommand': () => this.registerSubCommands(path, item),
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

  protected registerEvent (path, item: { new(): MineralEvent, event: string }): void {
    const event = new item() as MineralEvent & { event: string, client }
    event.logger = this.application.logger
    event.client = this.application.client

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

  protected registerCommand (path, item: { new(): MineralCommand }) {
    const command = new item() as MineralCommand & { data, getOption }

    command.logger = this.application.logger
    command.client = this.application.client
    command.data = item.prototype.data

    command.getLabel = () => command.data.label
    command.getDescription = () => command.data.description
    command.getOption = (name: string) => command.data.options.find((option) => (
      option.name === name
    ))

    this.application.container.commands.set(path, command)
  }

  public registerSubCommands (path, item: { new(): MineralCommand }) {
    const subcommand = new item() as MineralCommand & { data }
    subcommand.logger = this.application.logger
    subcommand.client = this.application.client
    subcommand.data = {
      ...item.prototype.data,
      identifier: `${item.prototype.data.parent.join('.')}.${item.prototype.data.label}`
    }

    subcommand.getLabel = () => subcommand.data.label
    subcommand.getDescription = () => subcommand.data.description

    this.application.container.subcommands.set(path, subcommand)
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

          this.application.container.providers.set(item.path, provider)
        }
      }
    }
  }
}