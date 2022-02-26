import ReadyPacket from './ReadyPacket'
import Packet from '../entities/Packet'
import GuildCreatePacket from './GuildCreatePacket'
import MessageCreatePacket from './MessageCreatePacket'
import ChannelCreatePacket from './ChannelCreatePacket'
import ChannelDeletePacket from './ChannelDeletePacket'
import ChannelUpdatePacket from './ChannelUpdatePacket'
import InviteCreatePacket from './InviteCreatePacket'
import InviteDeletePacket from './InviteDeletePacket'
import MemberJoinPacket from './MemberJoinPacket'
import MessageReactionAdd from './MessageReactionAdd'
import MessageReactionRemove from './MessageReactionRemove'
import MessageDeletePacket from './MessageDeletePacket'
import MessageUpdatePacket from './MessageUpdatePacket'
import MemberLeavePacket from './MemberLeavePacket'
import RoleCreatePacket from './RoleCreatePacket'
import RoleUpdatePacket from './RoleUpdatePacket'
import RoleDeletePacket from './RoleDeletePacket'
import RuleAcceptPacket from './RuleAcceptPacket'
import TypingStartPacket from './TypingStartPacket'
import VoiceJoinPacket from './VoiceJoinPacket'
import VoiceLeavePacket from './VoiceLeavePacket'
import MemberTimeoutAddPacket from './MemberTimeoutAddPacket'
import MemberTimeoutRemovePacket from './MemberTimeoutRemovePacket'
import CommandInteractionPacket from './CommandInteractionPacket'
import Collection from '../../api/utils/Collection'
import MenuInteractionPacket from './MenuInteractionPacket'
import EmojiCreatePacket from './EmojiCreatePacket'
import EmojiDeletePacket from './EmojiDeletePacket'
import EmojiUpdatePacket from './EmojiUpdatePacket'
import ModalInteractionPacket from './ModalInteractionPacket'
import MemberRoleAddPacket from './MemberRoleAddPacket'
import MemberRoleRemovePacket from './MemberRoleRemovePacket'
import PresenceUpdatePacket from './PresenceUpdatePacket'
import VoiceStateUpdatePacket from './VoiceStateUpdatePacket'
import GuildUpdatePacket from './GuildUpdatePacket'

export default class PacketManager {
  public packets: Collection<string, Packet[]> = new Collection()

  constructor () {
    this.register(
      new ReadyPacket(),
      new GuildCreatePacket(),
      new GuildUpdatePacket(),
      new MessageCreatePacket(),
      new MessageDeletePacket(),
      new MessageUpdatePacket(),
      new ChannelCreatePacket(),
      new ChannelDeletePacket(),
      new ChannelUpdatePacket(),
      new MemberJoinPacket(),
      new MemberLeavePacket(),
      new InviteCreatePacket(),
      new InviteDeletePacket(),
      new MessageReactionAdd(),
      new MessageReactionRemove(),
      new RoleCreatePacket(),
      new RoleUpdatePacket(),
      new RoleDeletePacket(),
      new RuleAcceptPacket(),
      new TypingStartPacket(),
      new VoiceStateUpdatePacket(),
      new VoiceJoinPacket(),
      new VoiceLeavePacket(),
      new MemberTimeoutAddPacket(),
      new MemberTimeoutRemovePacket(),
      new CommandInteractionPacket(),
      new MenuInteractionPacket(),
      new ModalInteractionPacket(),
      new EmojiUpdatePacket(),
      new EmojiDeletePacket(),
      new EmojiCreatePacket(),
      new MemberRoleRemovePacket(),
      new MemberRoleAddPacket(),
      new PresenceUpdatePacket(),
    )
  }

  public register (...packets: Packet[]) {
    packets.forEach((packet: Packet) => {
      const packetEvent = this.packets.get(packet.packetType)
      if (!packetEvent) {
        this.packets.set(packet.packetType, [packet])
      } else {
        packetEvent.push(packet)
      }
    })
  }

  public resolve (packetType: string) {
    return this.packets.get(packetType)
  }
}