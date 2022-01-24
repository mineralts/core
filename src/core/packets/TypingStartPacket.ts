
import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { Guild, GuildMember, TextChannelResolvable } from '../../api/entities'

export default class TypingStartPacket extends Packet {
  public packetType = 'TYPING_START'

  public async handle (assembler: Assembler, payload: any) {
    const guild: Guild | undefined = assembler.application.client.guilds.cache.get(payload.guild_id)
    const channel: TextChannelResolvable | undefined = guild?.channels.cache.get(payload.channel_id)
    const member: GuildMember | undefined = guild?.members.cache.get(payload.user_id)

    if (member) {
      assembler.eventListener.emit('typingStart', member!, channel)
    }
  }
}