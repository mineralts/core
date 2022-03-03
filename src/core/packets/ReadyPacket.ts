import { DateTime } from 'luxon'
import Packet from '../entities/Packet'
import Collection from '../../api/utils/Collection'
import UserFlags from '../../api/entities/user/UserFlags'
import { FlagIdentifier, FlagLabel } from '../../api/types'
import User from '../../api/entities/user'
import Client from '../../api/entities/client'
import Application from '../../application/Application'

export default class ReadyPacket extends Packet {
  public packetType = 'READY'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const environment = Application.singleton().resolveBinding('Mineral/Core/Environment')

    const flag = new UserFlags(
      FlagIdentifier[payload.user.public_flags || 0],
      FlagLabel[payload.user.public_flags || 0],
      payload.user.public_flags ||0
    )

    const user = new User(
      payload.user.id,
      payload.user.username,
      payload.user.discriminator,
      `${payload.user.username}#${payload.user.discriminator}`,
      payload.user.bot,
      DateTime.fromISO(payload.user.premium_since),
      payload.user.verified,
      payload.user.mfa_enabled,
      flag,
      payload.user.email,
      payload.user.avatar,
      payload.user.banner,
      undefined
    )

    const token = environment?.resolveKey('token')

    if (!token) {
      throw new Error('No token was provided')
    }

    const client = new Client(
      token,
      {
        intents: environment?.resolveKey('intents')?.selected,
      },
      user,
      payload.session_id,
      payload.presences,
      payload.application,
      new Collection()
    )

    Application.singleton().registerBinding('Mineral/Core/Client', client)

    const assembler = await Application.singleton().resolveBinding('Mineral/Core/Assembler')
    await assembler.register()
    await client.registerGlobalCommands()

    emitter.emit('ready', client)
  }
}