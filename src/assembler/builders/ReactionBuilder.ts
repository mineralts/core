import { Client, Emoji, Reaction, GuildMember } from '../../api/entities'

export default class ReactionBuilder {
  constructor (private client: Client, private readonly emoji: Emoji, private member: GuildMember) {
  }

  public build () {
    return new Reaction(this.emoji, this.member)
  }
}