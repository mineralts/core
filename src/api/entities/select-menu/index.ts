import { ComponentType, MenuSelect, MenuSelectOption } from '../../types'
import { parseEmoji } from '../../utils'
import Application from '../../../application/Application'

export default class SelectMenu {
  public type: ComponentType = ComponentType.SELECT_MENU
  public customId: string | undefined
  public minValues = 1
  public maxValues = 1
  public placeholder?: string
  public disabled = false
  public readonly choices: MenuSelectOption[] = []

  constructor (options?: MenuSelect) {
    if (options) {
      this.customId = options?.customId
      this.minValues = options?.minValues || 1
      this.maxValues = options?.maxValues || 1
      this.placeholder = options?.placeholder
      this.disabled = options?.disabled || false
      this.choices = options.choices
    }
  }

  public setCustomId (identifier: string) {
    this.customId = identifier
    return this
  }

  public setMinimalValue (value: number) {
    this.minValues = value
    return this
  }

  public setMaximalValue (value: number) {
    this.maxValues = value
    return this
  }

  public setPlaceholder (value: string) {
    this.placeholder = value
    return this
  }

  public isDisabled (): boolean {
    return this.disabled
  }

  public setDisabled (value: boolean) {
    this.disabled = value
    return this
  }

  public addOption (option: { label: string, value: unknown, description?: string, emoji?: any, default?: boolean }) {
    this.choices.push(option)
    return this
  }

  public toJson () {
    if (!this.customId) {
      const console = Application.singleton().resolveBinding('Mineral/Core/Console')
      console.logger.error('Select menu component has not customId.')
      process.exit(0)
    }

    return {
      type: this.type,
      custom_id: this.customId,
      min_values: this.minValues,
      max_values: this.maxValues,
      placeholder: this.placeholder,
      disabled: this.disabled,
      options: this.choices.map((option: MenuSelectOption) => ({
        label: option.label,
        value: option.value,
        description: option.description,
        emoji: option.emoji
          ? parseEmoji(option.emoji as string)
          : null,
        default: option.default,
      })),
    }
  }
}