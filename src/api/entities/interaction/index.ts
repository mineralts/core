import { ComponentType, InteractionType, Snowflake } from '../../types'
import Message from '../message'
import GuildMember from '../guild/GuildMember'

export default class Interaction {
  constructor (
    public id: Snowflake,
    public version: number,
    public type: keyof typeof InteractionType,
    public token: string,
    public customId: string | undefined,
    public componentType: keyof typeof ComponentType | undefined,
    public message: Message | undefined,
    public member: GuildMember
  ) {
  }
}