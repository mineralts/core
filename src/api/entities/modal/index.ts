import ModalRow from './ModalRow'
import Application from '../../../application/Application'
import { InputOption, MessageComponentResolvable } from '../../types'

export default class Modal {
  public customId: string
  public title: string
  public components: ModalRow[] = []
  public private = false

  constructor (options?: { customId: string, title: string, components?: ModalRow[] }) {
    if (!options) {
      return
    }

    this.customId = options.customId
    this.title = options.title

    if ('components' in options) {
      this.components = options.components!
    }
  }

  public setCustomId (value: string) {
    this.customId = value
    return this
  }

  public setTitle (value: string) {
    this.title = value
    return this
  }

  public addInput (option: InputOption) {
    const row = new ModalRow()
      .addInput(option)

    this.components.push(row)
    return this
  }

  public toJson () {
    if (!this.customId) {
      const logger = Application.getLogger()
      logger.error(`${this.title} component has not customId.`)
      process.exit(0)
    }

    const components = this.components?.map((row: ModalRow) => {
      row.components = row.components.map((component: MessageComponentResolvable) => {
        return component
      }) as any[]
      return row
    })

    return {
      custom_id: this.customId,
      title: this.title,
      components
    }
  }
}