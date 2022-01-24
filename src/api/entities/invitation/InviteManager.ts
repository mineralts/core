import Collection from '../../utils/Collection'
import Invite from './Invite'

export default class InviteManager {
  public cache: Collection<string, Invite> = new Collection()
}