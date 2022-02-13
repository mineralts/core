import Activity from '../activity'
import GuildMember from '../guild/GuildMember'
import { PresenceStatus } from '../../types'
import Game from './Game'

export default class Presence {
  constructor (
    public member: GuildMember,
    public status: keyof typeof PresenceStatus,
    public web: string | null,
    public desktop: string | null,
    public mobile: string | null,
    public activities: Activity[],
    public game: Game | undefined
  ) {
  }
}