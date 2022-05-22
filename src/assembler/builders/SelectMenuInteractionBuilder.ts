import Client from '../../api/entities/client'
import GuildMember from '../../api/entities/guild/GuildMember'
import MessageBuilder from './MessageBuilder'
import SelectMenuInteraction from '../../api/entities/interaction/SelectMenuInteraction'

export default class SelectMenuInteractionBuilder {
  constructor (private client: Client, private member: GuildMember) {
  }

  public build (payload: any) {
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
      this.member,
      payload.data.values
    )
  }
}