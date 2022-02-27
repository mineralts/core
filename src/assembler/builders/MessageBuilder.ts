import {
  Button,
  ButtonStyle,
  ComponentType,
  EmbedRow,
  MessageEmbed,
  SelectMenu,
  Snowflake,
} from '../../api/entities'
import { DateTime } from 'luxon'
import { keyFromEnum } from '../../api/utils'
import Client from '../../api/entities/client'
import TextChannel from '../../api/entities/channels/TextChannel'
import Collection from '../../api/utils/Collection'
import MentionResolvable from '../../api/entities/mention/MentionResolvable'
import Message from '../../api/entities/message'
import MessageAttachment from '../../api/entities/message/MessageAttachment'
import EmbedAuthor from '../../api/entities/embed/EmbedAuthor'
import EmbedImage from '../../api/entities/embed/EmbedImage'
import EmbedThumbnail from '../../api/entities/embed/EmbedThumbnail'
import EmbedFooter from '../../api/entities/embed/EmbedFooter'

export default class MessageBuilder {
  constructor (private client: Client) {
  }

  public build (payload: any) {
    if (!('author' in payload && 'mention_roles' in payload && 'embeds' in payload && 'components' in payload)) {
      return
    }

    const guild = this.client.guilds.cache.get(payload.guild_id)!
    const channel = guild.channels.cache.get(payload.channel_id) as TextChannel

    const author = guild.members.cache.get(payload.author?.id) || guild.bots.cache.get(payload.author?.id)

    const mentionChannel: Collection<Snowflake, any> = new Collection()
    const channelMentions = payload.content
      ? payload.content.split(' ')
        .filter((word: string) => word.startsWith('<#'))
        .map((word: string) => {
          return word
            .replace(/<#/g, '')
            .replace(/>/g, '')
        })
      : []

    channelMentions.forEach((id: Snowflake) => {
      const channel = guild?.channels.cache.get(id)
      mentionChannel.set(channel!.id, channel)
    })

    const mentionResolvable = new MentionResolvable(
      payload.mention_everyone,
      payload.mention_roles.map((roleId: Snowflake) => guild?.roles.cache.get(roleId)),
      payload.mentions,
      mentionChannel
    )

    return new Message(
      payload.id,
      payload.type,
      payload.flags,
      payload.tts,
      payload.timestamp
        ? DateTime.fromISO(payload.timestamp)
        : null,
      payload.edited_timestamp
        ? DateTime.fromISO(payload.edited_timestamp)
        : null,
      payload.referenced_message
        ? channel.messages.cache.get(payload.referenced_message)
        : null,
      payload.pinned,
      mentionResolvable,
      author,
      guild,
      channel,
      payload.content,
      new MessageAttachment(),
      payload.components.map((component) => {
        return this.walkComponent(component)
      }),
      payload.embeds.map((embed) => {
        const messageEmbed = new MessageEmbed()
        messageEmbed.title = embed.title
        messageEmbed.description = embed.description
        messageEmbed.author = embed.author
          ? new EmbedAuthor(embed.author.name, embed.author.url, embed.author.icon)
          : undefined
        messageEmbed.fields = embed.fields
          ? embed.fields.map((field) => ({
            name: field.title,
            value: field.value,
            inline: field.inline
          }))
          : []
        messageEmbed.timestamp = DateTime.fromISO(embed.timestamp)
        messageEmbed.color = embed.color
        messageEmbed.url = embed.url
        messageEmbed.image = new EmbedImage(payload.url, payload.proxy_url)
        messageEmbed.thumbnail = new EmbedThumbnail(payload.url, payload.proxy_url)
        messageEmbed.footer = new EmbedFooter(payload.text, payload.icon_url, payload.proxy_image)
        return messageEmbed
      })
    )
  }

  private walkComponent (component) {
    if (component.type === ComponentType.ACTION_ROW) {
      return new EmbedRow()
        .addComponents(
          component.components.map((component) => (
            this.walkComponent(component)
          ))
        )
    }

    if (component.type === ComponentType.BUTTON) {
      return new Button({
        style: keyFromEnum(ButtonStyle, component.style) as Exclude<keyof typeof ButtonStyle, 'LINK'>,
        customId: component.custom_id,
        label: component.label || null,
        emoji: component.emoji?.name || null,
        disabled: component.disabled || false
      })
    }

    if (component.type === ComponentType.SELECT_MENU) {
      return new SelectMenu({
        customId: component.custom_id,
        minValues: component.min_values,
        maxValues: component.max_values,
        placeholder: component.placeholder || null,
        disabled: component.disabled || false,
        choices: component.options
      })
    }
  }

}