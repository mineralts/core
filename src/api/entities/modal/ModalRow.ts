import { ComponentType, InputOption, InputStyle, MessageComponentResolvable } from '../../types'
import Application from '../../../application/Application'

export default class ModalRow {
  public type: ComponentType = ComponentType.ACTION_ROW
  public components: any[] = new Proxy([], {
    set: function(target: MessageComponentResolvable[], property: string | symbol, value) {
      if (target.length > 5) {
        const logger = Application.getLogger()
        logger.error(`A row can contain a maximum of 5 components, ${target.length}.`)
        process.exit(1)
      }
      target[property] = value
      return true
    }
  })

  public addInput (option: InputOption) {
    this.components.push({
      type: ComponentType.TEXT_INPUT,
      custom_id: option.customId,
      style: InputStyle[option.style],
      label: option.label,
      min_length: option.minLength,
      max_length: option.maxLength,
      required: option.required,
      value: option.defaultValue,
      placeholder: option.placeholder,
    })
    return this
  }
}