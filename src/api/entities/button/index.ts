import Emoji from '../emoji'
import { ButtonStyle, ComponentType, Snowflake } from '../../types'
import { keyFromEnum } from '../../utils'
import BaseButton from './BaseButton'
import Application from '../../../application/Application'

export default class Button extends BaseButton {
  public customId?: Snowflake
  public type: keyof typeof ComponentType = 'BUTTON'
  public style: Exclude<keyof typeof ButtonStyle, 'LINK'>

  constructor (
    props?: {
      style: Exclude<keyof typeof ButtonStyle, 'LINK'>
      label?: string,
      emoji?: string | Emoji,
      customId?: string
      disabled?: boolean
    }
  ) {
    if (props) super(props.label, undefined, props.disabled)
    else super(undefined, undefined, undefined)

    this.style = keyFromEnum(ButtonStyle, undefined) as Exclude<keyof typeof ButtonStyle, 'LINK'>

    if (props?.emoji) {
      const emoji = this.parseEmoji(props.emoji) as any
      this.setEmoji(emoji)
    }

    if (props?.style) {
      this.setStyle(props.style)
    }

    if (props?.customId) {
      this.customId = props?.customId
    }
  }

  public setStyle (style: Exclude<keyof typeof ButtonStyle, 'LINK'>) {
    this.style = style
    return this
  }

  public setCustomId (identifier: string) {
    this.customId = identifier
    return this
  }

  public toJson () {
    if (!this.customId) {
      const logger = Application.getLogger()
      logger.error(`${this.label} component has not customId.`)
      process.exit(0)
    }

    return {
      ...super.toJson(),
      type: ComponentType[this.type],
      style: ButtonStyle[this.style],
      custom_id: this.customId
    }
  }
}