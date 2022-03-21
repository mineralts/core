import Packet from '../entities/Packet'
import { ChannelBuilder } from '../../assembler/builders'
import DMChannel from '../../api/entities/channels/DMChannel'
import StageChannel from '../../api/entities/channels/StageChannel'
import NewsChannel from '../../api/entities/channels/NewsChannel'
import TextChannelResolvable from '../../api/entities/channels/TextChannelResolvable'
import MessageManager from '../../api/entities/message/MessageManager'
import TextChannel from '../../api/entities/channels/TextChannel'
import CategoryChannel from '../../api/entities/channels/CategoryChannel'
import VoiceChannel from '../../api/entities/channels/VoiceChannel'
import Application from '../../application/Application'

export default class ChannelCreatePacket extends Packet {
  public packetType = 'CHANNEL_CREATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const channelBuilder = new ChannelBuilder(client!, guild)
    const channel = channelBuilder.build(payload)

    guild.channels.cache.set(channel.id, channel)

    if (channel instanceof TextChannelResolvable) {
      channel.parent = guild.channels.cache.get(payload.parent_id)
      channel.messages = new MessageManager(channel)
      channel.guild = guild
    }

    if (channel instanceof DMChannel) {
      client.privates.cache.set(channel.id, channel)
    }

    if (channel instanceof TextChannel) emitter.emit('create:TextChannel', channel)
    if (channel instanceof DMChannel) emitter.emit('create:DmChannel', channel)
    if (channel instanceof CategoryChannel) emitter.emit('create:CategoryChannel', channel)
    if (channel instanceof VoiceChannel) emitter.emit('create:VoiceChannel', channel)
    if (channel instanceof StageChannel) emitter.emit('create:StageChannel', channel)
    if (channel instanceof NewsChannel) emitter.emit('create:NewsChannel', channel)

    emitter.emit('create:channel', channel)
  }
}