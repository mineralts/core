import Emoji from '../emoji'
import BaseButton from './BaseButton'
import Ioc from '../../../Ioc'
import { ButtonStyle } from '../../types'

export default class ButtonLink extends BaseButton {
  private url?: string
  private style: keyof typeof ButtonStyle = 'LINK'

  constructor (
    props?: {
      label?: string,
      emoji?: string | Emoji,
      url: string
      disabled?: boolean
    }
  ) {
    if (props) super(props.label, undefined, props.disabled)
    else super(undefined, undefined, undefined)

    if (props?.emoji) {
      this.setEmoji(this.parseEmoji(props.emoji) as any)
    }

    if (props?.url) {
      this.url = props.url
    }
  }

  public setUrl (url: string) {
    this.url = url
    return this
  }

  public toJson () {
    const console = Ioc.singleton().resolve('Mineral/Core/Console')
    if (!this.url) {
      console.logger.error(new Error(`${this.label} component has not url.`))
      process.exit(0)
    }

    return {
      ...super.toJson(),
      style: ButtonStyle[this.style],
      url: this.url
    }
  }
}