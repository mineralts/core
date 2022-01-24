import Emoji from '../emoji'
import { parseEmoji } from '../../utils'

export default class BaseButton {
  constructor (
    public label?: string,
    public emoji?: string | Emoji,
    public disabled: boolean = false,
  ) {
  }

  public setLabel (value: string) {
    this.label = value
    return this
  }

  public setEmoji (emoji: string | Emoji) {
    this.emoji = this.parseEmoji(emoji) as any
    return this
  }

  public isDisabled (): boolean {
    return this.disabled
  }

  public setDisabled (value: boolean) {
    this.disabled = value
    return this
  }

  protected parseEmoji (emoji: string | Emoji) {
    if (typeof emoji === 'string') {
      return parseEmoji(emoji)
    }
  }

  protected toJson () {
    return {
      label: this.label,
      emoji: this.emoji,
      disabled: this.disabled,
    }
  }
}