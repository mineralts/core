import { Snowflake } from '../../../api/types'
import ThreadMember from './ThreadMember'
import Collection from '../../../api/utils/Collection'

export default interface ThreadMemberManager {
  cache: Collection<Snowflake, ThreadMember>
}