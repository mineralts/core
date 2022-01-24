import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { ChannelBuilder } from '../../assembler/builders'
import { MessageManager, TextChannelResolvable } from '../../api/entities'

export default class ChannelUpdatePacket extends Packet {
  public packetType = 'CHANNEL_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)
    const before = guild?.channels.cache.get(payload.id)

    const channelBuilder = new ChannelBuilder(assembler.application.client as any, assembler.application.logger, guild as any)
    const after = channelBuilder.build(payload)

    if (after instanceof TextChannelResolvable) {
      after.parent = guild?.channels.cache.get(payload.parent_id)
      after.messages = new MessageManager(after)
      after.guild = guild as any
    }

    assembler.eventListener.emit('channelUpdate', before!, after)

    guild?.channels.cache.set(after.id, after as any)
  }
}