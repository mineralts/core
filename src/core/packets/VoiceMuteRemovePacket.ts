import Packet from '../entities/Packet'
import GuildMember from '../../api/entities/guild/GuildMember'
import Application from '../../application/Application'

export default class VoiceMuteRemovePacket extends Packet {
  public packetType = 'VOICE_STATE_UPDATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const member: GuildMember | undefined = guild.members.cache.get(payload.member.user.id)

    if (member?.voice.channelId && member?.voice.mute === true && payload.mute === false) {
      emitter.emit('remove:MemberMute', member)
    }
  }
}