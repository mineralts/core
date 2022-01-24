import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { ChannelBuilder } from '../../assembler/builders'
import { MessageManager, TextChannelResolvable } from '../../api/entities'
import DMChannel from '../../api/entities/channels/DMChannel'

export default class ChannelCreatePacket extends Packet {
  public packetType = 'CHANNEL_CREATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)

    const channelBuilder = new ChannelBuilder(assembler.application.client, assembler.application.logger, guild as any)
    const channel = channelBuilder.build(payload)

    guild?.channels.cache.set(channel.id, channel as any)

    if (channel instanceof TextChannelResolvable) {
      channel.parent = guild?.channels.cache.get(payload.parent_id)
      channel.messages = new MessageManager(channel)
      channel.guild = guild
    }

    if (channel instanceof DMChannel) {
      assembler.application.client.privates.cache.set(channel.id, channel)
    }

    assembler.eventListener.emit('channelCreate', channel)
  }
}