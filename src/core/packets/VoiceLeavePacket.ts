import Packet from '../entities/Packet'
import Application from '../../application/Application'

export default class VoiceLeavePacket extends Packet {
  public packetType = 'VOICE_STATE_UPDATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const guild = client?.guilds.cache.get(payload.guild_id)
    const before = guild?.members.cache.get(payload.member.user.id)

    if (!before?.voice.channel || before.voice.channel.id === payload.channel_id) {
      return
    }

    const after = guild?.members.cache.get(payload.member.user.id)

    emitter.emit('leave:VoiceMember', after!)
  }
}