import Packet from '../entities/Packet'
import TextChannelResolvable from '../../api/entities/channels/TextChannelResolvable'
import Guild from '../../api/entities/guild/Guild'
import GuildMember from '../../api/entities/guild/GuildMember'
import Ioc from '../../Ioc'

export default class TypingStartPacket extends Packet {
  public packetType = 'TYPING_START'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild: Guild | undefined = client?.guilds.cache.get(payload.guild_id)
    const channel: TextChannelResolvable | undefined = guild?.channels.cache.get(payload.channel_id)
    const member: GuildMember | undefined = guild?.members.cache.get(payload.user_id)

    if (member && channel) {
      emitter.emit('start:typing', member!, channel)
    }
  }
}