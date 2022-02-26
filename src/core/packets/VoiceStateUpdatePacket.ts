import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import VoiceChannel from '../../api/entities/channels/VoiceChannel'
import GuildMember from '../../api/entities/guild/GuildMember'
import { VoiceStateBuilder } from '../../assembler/builders'
import VoiceState from '../../api/entities/voice/VoiceState'

export default class VoiceStateUpdatePacket extends Packet {
  public packetType = 'VOICE_STATE_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild = client.guilds.cache.get(payload.guild_id)
    const before = guild?.members.cache.get(payload.member.user.id)

    const voiceChannel: VoiceChannel | undefined = guild?.channels.cache.get(payload.channel_id)
    const member: GuildMember | undefined = guild?.members.cache.get(payload.member.user.id)

    const voiceStateBuilder: VoiceStateBuilder = new VoiceStateBuilder(client as any, guild!, member!, voiceChannel!)
    const voiceState: VoiceState = voiceStateBuilder.build(payload)

    assembler.eventListener.emit('update:VoiceState', before, voiceState)
  }
}