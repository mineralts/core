import BaseButton from './BaseButton'
import { ButtonStyle } from '../../../api/types'

export default interface ButtonLink extends BaseButton {
  readonly url?: string
  readonly style: keyof typeof ButtonStyle

  setUrl (url: string): this
}