import Collection from '../../../api/utils/Collection'
import Invite from './Invite'

export default interface InviteManager {
  readonly cache: Collection<string, Invite>
}