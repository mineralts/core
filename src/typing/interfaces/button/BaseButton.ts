import Emoji from '../emoji'

export default interface BaseButton {
  readonly label?: string
  readonly emoji?: string | Emoji
  readonly disabled: boolean

  setLabel (value: string): this
  setEmoji (emoji: string | Emoji): this
  isDisabled (): boolean
  setDisabled (value: boolean): this
}