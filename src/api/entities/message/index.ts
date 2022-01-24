import { MessageOption, Snowflake } from '../../types'
import { DateTime } from 'luxon'
import GuildMember from '../guild/GuildMember'
import Guild from '../guild/Guild'
import TextChannel from '../channels/TextChannel'
import Emoji from '../emoji'
import MessageAttachment from './MessageAttachment'
import ReactionManager from '../reaction/ReactionManager'
import MessageEmbed from '../embed/MessageEmbed'
import { parseEmoji } from '../../utils'
import MentionResolvable from '../mention/MentionResolvable'
import Client from '../client'
import Application from '../../../application/Application'

export default class Message {
  public reactions: ReactionManager = new ReactionManager(this)

  constructor (
    public id: Snowflake,
    public type: number,
    public flags: string[],
    public tts: boolean,
    public createdAt: DateTime | null,
    public updatedAt: DateTime | null,
    public referencedMessage: Message | null | undefined,
    public pinned: boolean,
    public mentions: MentionResolvable,
    public author: GuildMember | undefined,
    public guild: Guild | undefined,
    public channel: TextChannel,
    public content: string,
    public attachment: MessageAttachment,
    public components: any[],
    public embeds: MessageEmbed[],
  ) {
  }

  public isTTS (): boolean {
    return this.tts
  }

  public isPinned (): boolean {
    return this.pinned
  }

  public async crossPost () {
    if (this.channel.type === 'GUILD_NEWS') {
      // const request = Application.createRequest()
      // const request = new Request(`/channels/${this.channel?.id}/messages/${this.id}/crosspost`)
      // console.log(await request.post(null, option))
    }
  }

  public async pin () {
    if (!this.isPinned) {
      const request = Application.createRequest()
      await request.patch(`/channels/${this.channel?.id}/pins/${this.id}`, {})
    }
  }

  public async unPin () {
    if (!this.isPinned) {
      const request = Application.createRequest()
      await request.delete(`/channels/${this.channel?.id}/pins/${this.id}`)
    }
  }

  public async delete () {
    const request = Application.createRequest()
    await request.delete(`/channels/${this.channel?.id}/messages/${this.id}`)
  }

  public async edit (message: MessageOption) {
    const request = Application.createRequest()
    await request.patch(`/channels/${this.channel?.id}/messages/${this.id}`, {
      content: message.content,
      embeds: message.embeds,
      attachment: message.attachment,
      components: message.components,
    })
  }

  public async reload () {
    await this.edit({
      content: this.content,
      embeds: this.embeds,
      attachment: this.attachment,
      components: this.components,
      tts: this.tts,
      private: false,
    })
  }

  public async react (emoji: string | Emoji, ) {
    const encodedEmoji = emoji instanceof Emoji
      ? encodeURI(`${emoji.label}:${emoji.id}`)
      : encodeURI(emoji)

    const request = Application.createRequest()
    await request.patch(`/channels/${this.channel?.id}/messages/${this.id}/reactions/${encodedEmoji}/@me`, null)
    const client = Application.getClient()

    let a: Emoji = emoji as Emoji
    if (typeof emoji === 'string') {
      const parsedEmoji = parseEmoji(emoji)
      a = new Emoji(parsedEmoji!.id!, parsedEmoji!.name, false, true, false, [])
    }

    this.reactions.addReaction(a, client as unknown as Client | GuildMember)
  }
}