import Assembler from '../../assembler/Assembler'
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

    if (before instanceof TextChannel) assembler.eventListener.emit('update:TextChannel', before, after)
    if (before instanceof DMChannel) assembler.eventListener.emit('update:DmChannel', before, after)
    if (before instanceof CategoryChannel) assembler.eventListener.emit('update:CategoryChannel', before, after)
    if (before instanceof VoiceChannel) assembler.eventListener.emit('update:VoiceChannel', before, after)
    if (before instanceof StageChannel) assembler.eventListener.emit('update:StageChannel', before, after)
    if (before instanceof NewsChannel) assembler.eventListener.emit('update:NewsChannel', before, after)

    assembler.eventListener.emit('update:Channel', before, after)

    guild?.channels.cache.set(after.id, after as any)
  }
}