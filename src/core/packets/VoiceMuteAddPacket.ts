import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import GuildMember from '../../api/entities/guild/GuildMember'

export default class VoiceMuteAddPacket extends Packet {
  public packetType = 'VOICE_STATE_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild = client.guilds.cache.get(payload.guild_id)
    const member: GuildMember | undefined = guild?.members.cache.get(payload.member.user.id)

    if (member?.voice.channelId && member?.voice.mute === false && payload.mute === true) {
      assembler.eventListener.emit('add:MemberMute', member)
    }
  }
}