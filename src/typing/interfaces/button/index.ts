import { ButtonStyle, Snowflake } from '../../../api/types'
import BaseButton from './BaseButton'

export default interface Button extends BaseButton {
  readonly customId?: Snowflake
  readonly style: Exclude<keyof typeof ButtonStyle, 'LINK'>

  setStyle (style: Exclude<keyof typeof ButtonStyle, 'LINK'>): this
  setCustomId (identifier: string): this
}