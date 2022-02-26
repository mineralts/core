import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { VoiceStateBuilder } from '../../assembler/builders'
import VoiceChannel from '../../api/entities/channels/VoiceChannel'
import Guild from '../../api/entities/guild/Guild'
import GuildMember from '../../api/entities/guild/GuildMember'
import VoiceState from '../../api/entities/voice/VoiceState'

export default class VoiceJoinPacket extends Packet {
  public packetType = 'VOICE_STATE_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    if (!payload.channel_id) {
      return
    }

    const client = assembler.application.client
    const guild: Guild | undefined = client.guilds.cache.get(payload.guild_id)
    const voiceChannel: VoiceChannel | undefined = guild?.channels.cache.get(payload.channel_id)
    const member: GuildMember | undefined = guild?.members.cache.get(payload.member.user.id)

    const voiceStateBuilder: VoiceStateBuilder = new VoiceStateBuilder(client as any, guild!, member!, voiceChannel!)
    const voiceState: VoiceState = voiceStateBuilder.build(payload)

    if (member) {
      member.voice = voiceState
    }

    assembler.eventListener.emit('join:VoiceMember', member!)
  }
}