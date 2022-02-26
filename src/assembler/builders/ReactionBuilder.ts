import GuildMember from '../../api/entities/guild/GuildMember'
import Emoji from '../../api/entities/emoji'
import Client from '../../api/entities/client'
import Reaction from '../../api/entities/reaction/Reaction'

export default class ReactionBuilder {
  constructor (private client: Client, private readonly emoji: Emoji, private member: GuildMember) {
  }

  public build () {
    return new Reaction(this.emoji, this.member)
  }
}