import Assembler from '../../assembler/Assembler'
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

export default class ChannelCreatePacket extends Packet {
  public packetType = 'CHANNEL_CREATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)

    const channelBuilder = new ChannelBuilder(assembler.application.client, assembler.application.logger, guild as any)
    const channel = channelBuilder.build(payload)

    guild?.channels.cache.set(channel.id, channel)

    if (channel instanceof TextChannelResolvable) {
      channel.parent = guild?.channels.cache.get(payload.parent_id)
      channel.messages = new MessageManager(channel)
      channel.guild = guild
    }

    if (channel instanceof DMChannel) {
      assembler.application.client.privates.cache.set(channel.id, channel)
    }

    if (channel instanceof TextChannel) assembler.eventListener.emit('create:TextChannel', channel)
    if (channel instanceof DMChannel) assembler.eventListener.emit('create:DmChannel', channel)
    if (channel instanceof CategoryChannel) assembler.eventListener.emit('create:CategoryChannel', channel)
    if (channel instanceof VoiceChannel) assembler.eventListener.emit('create:VoiceChannel', channel)
    if (channel instanceof StageChannel) assembler.eventListener.emit('create:StageChannel', channel)
    if (channel instanceof NewsChannel) assembler.eventListener.emit('create:NewsChannel', channel)

    assembler.eventListener.emit('create:channel', channel)
  }
}