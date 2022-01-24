import Emoji from '../emoji'
import GuildMember from '../guild/GuildMember'
import Client from '../client'

export default interface Reaction {
  readonly emoji: Emoji
  readonly member: GuildMember | Client
}