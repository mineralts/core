import Packet from '../entities/Packet'
import { MessageBuilder } from '../../assembler/builders'
import TextChannel from '../../api/entities/channels/TextChannel'
import Ioc from '../../Ioc'

export default class MessageUpdatePacket extends Packet {
  public packetType = 'MESSAGE_UPDATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const channel = guild.channels.cache.get(payload.channel_id) as TextChannel
    if (!channel) {
      return
    }

    const before = channel.messages.cache.get(payload.id)

    const messageBuilder = new MessageBuilder(client!)
    const after = messageBuilder.build(payload)

    if (after) {
      emitter.emit('update:Message', before || undefined, after)
      channel.messages.cache.set(after.id, after)
    }
  }
}