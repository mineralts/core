import Client from '../../api/entities/client'
import GuildMember from '../../api/entities/guild/GuildMember'
import ButtonInteraction from '../../api/entities/interaction/ButtonInteraction'
import MessageBuilder from './MessageBuilder'

export default class ButtonInteractionBuilder {
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

    return new ButtonInteraction(
      payload.id,
      payload.version,
      payload.token,
      message!,
      member!,
      payload.data.custom_id
    )
  }
}