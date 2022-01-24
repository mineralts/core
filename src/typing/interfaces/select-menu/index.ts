import { ComponentType, MenuSelectOption } from '../../../api/types'

export default interface SelectMenu {
  readonly type: ComponentType
  readonly customId: string | undefined
  readonly minValues: number
  readonly maxValues: number
  readonly placeholder?: string
  readonly disabled: boolean
  readonly choices: MenuSelectOption[]

  setCustomId (identifier: string): this
  setMinimalValue (value: number): this
  setMaximalValue (value: number): this
  setPlaceholder (value: string): this
  isDisabled (): boolean
  setDisabled (value: boolean): this
  addOption (option: { label: string, value: unknown, description?: string, emoji?: any, default?: boolean }): this
}