import Packet from '../entities/Packet'
import { MessageBuilder } from '../../assembler/builders'
import TextChannel from '../../api/entities/channels/TextChannel'
import Ioc from '../../Ioc'

export default class MessageCreatePacket extends Packet {
  public packetType = 'MESSAGE_CREATE'

  public async handle (payload: any) {
    if (!payload.guild_id || payload.type === 6) {
      return
    }

    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')
    const environment = Ioc.singleton().resolve('Mineral/Core/Environment')
    const useReflect = environment.resolveKey('reflect')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const channel = guild.channels.cache.get(payload.channel_id) as TextChannel
    const messageBuilder = new MessageBuilder(client!)
    const message = messageBuilder.build(payload)

    if (channel) {
      channel.lastMessageId = message!.id
      channel.lastMessage = message
      channel.messages.cache.set(message!.id, message!)
    }

    emitter.emit('create:Message', message)
    if (useReflect) {
      const reflect = Ioc.singleton().resolve('Mineral/Core/Reflect')
      reflect.sendEvent('MessageCreate', message)
    }
  }
}