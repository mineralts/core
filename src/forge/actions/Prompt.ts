import { prompt } from 'enquirer'
import Ioc from '../../Ioc'

export default class Prompt {
  private helpers = Ioc.singleton().resolve('Mineral/Core/Helpers')

  public async ask (message: string, options?: { placeholder: string }): Promise<string> {
    const answer = await prompt({
      type: 'input',
      name: this.helpers.camelCase(message),
      message,
      hint: options?.placeholder
    })

    return answer[this.helpers.camelCase(message)]
  }

  public async password (message: string): Promise<string> {
    const answer = await prompt({
      type: 'password',
      name: this.helpers.camelCase(message),
      message,
    })

    return answer[this.helpers.camelCase(message)]
  }

  public async confirm (message: string): Promise<boolean> {
    const answer = await prompt({
      type: 'confirm',
      name: this.helpers.camelCase(message),
      message
    })

    return answer[this.helpers.camelCase(message)]
  }

  public async select<T extends boolean> (message: string, options: { choices: string[], multiple: T }): Promise<T extends true ? string[] : string> {
    const answer = await prompt({
      type: options.multiple ? 'multiselect' : 'select',
      name: this.helpers.camelCase(message),
      message,
      choices: options.choices,
    })

    return answer[this.helpers.camelCase(message)]
  }

  public async autoComplete (message: string, choices: string[]): Promise<string> {
    const answer = await prompt({
      type: 'autocomplete',
      name: this.helpers.camelCase(message),
      message,
      choices,
    })

    return answer[this.helpers.camelCase(message)]
  }
}