import Client from '../../api/entities/client'
import GuildMember from '../../api/entities/guild/GuildMember'
import MessageBuilder from './MessageBuilder'
import SelectMenuInteraction from '../../api/entities/interaction/SelectMenuInteraction'

export default class SelectMenuInteractionBuilder {
  constructor (private client: Client, private member: GuildMember) {
  }

  public build (payload: any) {
    const guild = this.client.guilds.cache.get(payload.guild_id)
    const member = guild?.members.cache.get(payload.member.user.id)
    const messageBuilder = new MessageBuilder(this.client)
    const message = messageBuilder.build({
      ...payload.message,
      guild_id: payload.guild_id
    })

    return new SelectMenuInteraction(
      payload.id,
      payload.version,
      'MESSAGE_COMPONENT',
      payload.token,
      payload.data.custom_id,
      'SELECT_MENU',
      message!,
      member!
    )
  }
}