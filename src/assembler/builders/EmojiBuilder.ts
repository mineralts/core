import { Emoji, Guild } from '../../api/entities'

export default class EmojiBuilder {
  constructor (private guild?: Guild) {
  }

  public build (payload: any) {
    return new Emoji(
      payload.id,
      this.guild,
      payload.name,
      payload.managed,
      payload.available,
      payload.animated,
    )
  }
}