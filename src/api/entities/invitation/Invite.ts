import GuildMember from '../guild/GuildMember'
import { DateTime } from 'luxon'
import { ChannelResolvable } from '../../types'

export default class Invite {
  constructor (
    public owner: GuildMember,
    public channel: ChannelResolvable,
    public code: string,
    public count: number,
    public max: number,
    public temporary: boolean,
    public expireAt: DateTime,
    public createdAt: DateTime,
  ) {
  }
}