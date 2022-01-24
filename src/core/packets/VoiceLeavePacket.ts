import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'

export default class VoiceLeavePacket extends Packet {
  public packetType = 'VOICE_STATE_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild = client.guilds.cache.get(payload.guild_id)
    const before = guild?.members.cache.get(payload.member.user.id)

    if (!before?.voice.channel || before.voice.channel.id === payload.channel_id) {
      return
    }

    const after = guild?.members.cache.get(payload.member.user.id)

    assembler.eventListener.emit('voiceLeave', after!)
  }
}