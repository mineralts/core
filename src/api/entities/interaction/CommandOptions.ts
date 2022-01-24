/*
 * packages/CommandOptions.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { ChannelResolvable, CommandParamsResolvable, Snowflake } from '../../types'
import GuildMember from '../guild/GuildMember'

export default class CommandOptions {
  constructor (private params: any, private member: GuildMember) {
  }

  public getChannel (name: string): ChannelResolvable | undefined {
    const channel = this.params.options?.find((param: CommandParamsResolvable) => param.name == name) as unknown as { value: Snowflake }
    return this.member.guild.channels.cache.get(channel?.value)
  }

  public getMember (name: string): GuildMember | undefined {
    const channel = this.params.options?.find((param: CommandParamsResolvable) => param.name == name) as unknown as { value: Snowflake }
    return this.member.guild.channels.cache.get(channel?.value)
  }

  public getString (name: string): string | undefined {
    const stringValue = this.params.options?.find((param: CommandParamsResolvable) => param.name == name) as unknown as { value: string }
    return stringValue.value
  }

  public getNumber (name: string): number | undefined {
    const numberValue = this.params.options?.find((param: CommandParamsResolvable) => param.name == name) as unknown as { value: number }
    return numberValue.value
  }

  public getBoolean (name: string): boolean | undefined {
    const numberValue = this.params.options?.find((param: CommandParamsResolvable) => param.name == name) as unknown as { value: boolean }
    return numberValue.value
  }

  public getChoices<T> (name: string): T | undefined {
    const choiceValue = this.params.options?.find((param: CommandParamsResolvable) => param.name == name) as unknown as { value: T }
    return choiceValue.value
  }
}