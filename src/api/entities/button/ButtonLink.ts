import Emoji from '../emoji'
import BaseButton from './BaseButton'
import Application from '../../../application/Application'
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
    if (!this.url) {
      const logger = Application.getLogger()
      logger.error(`${this.label} component has not url.`)
      process.exit(0)
    }

    return {
      ...super.toJson(),
      style: ButtonStyle[this.style],
      url: this.url
    }
  }
}