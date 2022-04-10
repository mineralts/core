import Packet from '../entities/Packet'
import { ChannelBuilder } from '../../assembler/builders'
import TextChannelResolvable from '../../api/entities/channels/TextChannelResolvable'
import MessageManager from '../../api/entities/message/MessageManager'
import TextChannel from '../../api/entities/channels/TextChannel'
import DMChannel from '../../api/entities/channels/DMChannel'
import CategoryChannel from '../../api/entities/channels/CategoryChannel'
import VoiceChannel from '../../api/entities/channels/VoiceChannel'
import StageChannel from '../../api/entities/channels/StageChannel'
import NewsChannel from '../../api/entities/channels/NewsChannel'
import Ioc from '../../Ioc'

export default class ChannelUpdatePacket extends Packet {
  public packetType = 'CHANNEL_UPDATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const before = guild.channels.cache.get(payload.id)

    const channelBuilder = new ChannelBuilder(client, guild!)
    const after = channelBuilder.build(payload)

    if (after instanceof TextChannelResolvable) {
      after.parent = guild.channels.cache.get(payload.parent_id)
      after.messages = new MessageManager(after)
      after.guild = guild as any
    }

    if (before instanceof TextChannel) emitter.emit('update:TextChannel', before, after)
    if (before instanceof DMChannel) emitter.emit('update:DmChannel', before, after)
    if (before instanceof CategoryChannel) emitter.emit('update:CategoryChannel', before, after)
    if (before instanceof VoiceChannel) emitter.emit('update:VoiceChannel', before, after)
    if (before instanceof StageChannel) emitter.emit('update:StageChannel', before, after)
    if (before instanceof NewsChannel) emitter.emit('update:NewsChannel', before, after)

    emitter.emit('update:Channel', before, after)

    guild?.channels.cache.set(after.id, after as any)
  }
}