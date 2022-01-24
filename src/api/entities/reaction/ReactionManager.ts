import Message from '../message'
import { Snowflake } from '../../types'
import GuildMember from '../guild/GuildMember'
import Client from '../client'
import Emoji from '../emoji'
import Reaction from './Reaction'
import Collection from '../../utils/Collection'

export default class ReactionManager {
  public cache: Collection<Snowflake, Reaction[]> = new Collection()

  constructor (private message: Message) {
  }

  public addReaction(emoji: Emoji, member: GuildMember | Client) {
    const userReactions = this.cache.get(member.user.id)
    const reaction = new Reaction(emoji, member)

    if (!userReactions) {
      this.cache.set(member.user.id, [reaction])
      return
    }
    userReactions.push(reaction)
  }

  public async remove (member: Snowflake | GuildMember | Client) {
    const snowflake = member instanceof GuildMember || member instanceof Client ? member.user.id : member

    const memberReactions = this.cache.get(snowflake)
    // if (memberReactions?.length) {
    //   await Promise.all(
    //     memberReactions.map(async (reaction: Reaction) => {
    //       const encodedEmoji = encodeURI(reaction.emoji.id ? `${reaction.emoji.label}:${reaction.emoji.id}` : reaction.emoji.label)
    //       const request = new Request(`/channels/${this.message.channel?.id}/messages/${this.message.id}/reactions/${encodedEmoji}/${snowflake}`)
    //       return request.delete(option)
    //     })
    //   )
    // }
  }
}