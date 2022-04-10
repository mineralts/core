import Emoji from '../emoji'
import { ButtonStyle, ComponentType, Snowflake } from '../../types'
import { keyFromEnum } from '../../utils'
import BaseButton from './BaseButton'
import Ioc from '../../../Ioc'

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
      const console = Ioc.singleton().resolve('Mineral/Core/Console')
      console.logger.error(new Error(`${this.label} component has not customId.`))
    }

    return {
      ...super.toJson(),
      type: ComponentType[this.type],
      style: ButtonStyle[this.style],
      custom_id: this.customId
    }
  }
}