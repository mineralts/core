import { Client, GuildMember, TextChannelResolvable } from '../../api/entities'
import MenuInteraction from '../../api/entities/interaction/MenuInteraction'
import MessageBuilder from './MessageBuilder'

export default class MenuInteractionBuilder {
  constructor (private client: Client, private member: GuildMember) {
  }

  public build (payload: any) {
    const channel = this.member.guild.channels.cache.get<TextChannelResolvable>(payload.channel_id)

    if ('messages' in payload.data.resolved) {
      const messageBuilder = new MessageBuilder(this.client)
      const message = messageBuilder.build({
        ...payload.data.resolved.messages[payload.data.target_id],
        guild_id: this.member.guild.id,
      })
      channel?.messages.cache.set(message.id, message)
    }

    return new MenuInteraction(
      payload.id,
      payload.version,
      payload.token,
      this.member,
      channel,
      this.member.guild,
      payload.data
    )
  }
}