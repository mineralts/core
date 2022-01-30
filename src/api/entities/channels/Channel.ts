import { ChannelTypeResolvable, Snowflake } from '../../types'
import Guild from '../guild/Guild'
import CategoryChannel from './CategoryChannel'
import Application from '../../../application/Application'

export default class Channel {
  constructor (
    public id: Snowflake,
    public type: keyof typeof ChannelTypeResolvable,
    public name: string | undefined,
    public guildId: Snowflake | undefined,
    public guild: Guild | undefined,
    public parentId: Snowflake | undefined,
    public position: number,
    public parent?: CategoryChannel,
  ) {
  }

  public isText () {
    return ChannelTypeResolvable[this.type] === ChannelTypeResolvable.GUILD_TEXT
      || ChannelTypeResolvable[this.type] === ChannelTypeResolvable.GUILD_NEWS
  }

  public isVoice () {
    return ChannelTypeResolvable[this.type] === ChannelTypeResolvable.GUILD_VOICE
  }

  public isNews () {
    return ChannelTypeResolvable[this.type] === ChannelTypeResolvable.GUILD_NEWS
  }

  public isCategory () {
    return ChannelTypeResolvable[this.type] === ChannelTypeResolvable.GUILD_CATEGORY
  }

  public isStage () {
    return ChannelTypeResolvable[this.type] === ChannelTypeResolvable.GUILD_STAGE_VOICE
  }

  public async setParent (category: CategoryChannel | Snowflake) {
    const request = Application.createRequest()
    const parentId = typeof category === 'string'
      ? category
      : category.id

    await request.patch(`/channels/${this.id}`,{
      parent_id: parentId
    })

    this.parentId = parentId
    this.parent = this.guild?.channels.cache.get(parentId)
  }

  public async setName (value: string) {
    const request = Application.createRequest()
    await request.patch(`/channels/${this.id}`, {
      name: value
    })

    this.name = value
  }

  public async setPosition (position: number) {
    const request = Application.createRequest()
    await request.patch(`/channels/${this.id}`, { position })

    this.position = position
  }

  public async delete () {
    if (this.id === this.guild?.publicUpdateChannelId || this.id === this.guild?.ruleChannelId) {
      return
    }

    const request = Application.createRequest()
    await request.delete(`/channels/${this.id}`)
  }

  public toString() {
    return `<#${this.id}>`
  }
}