import { ComponentType, MessageComponentResolvable } from '../../../api/types'

export default interface EmbedRow {
  readonly type: ComponentType
  readonly components: MessageComponentResolvable[]

  addComponent (component: MessageComponentResolvable): this
  addComponents (components: MessageComponentResolvable[]): this
}