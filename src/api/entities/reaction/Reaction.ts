import Emoji from '../emoji'
import GuildMember from '../guild/GuildMember'
import Client from '../client'

export default class Reaction {
  constructor (
    public emoji: Emoji,
    public member: GuildMember | Client
  ) {
  }
}