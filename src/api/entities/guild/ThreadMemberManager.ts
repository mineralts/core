import Collection from '../../utils/Collection'
import { Snowflake } from '../../types'
import ThreadMember from './ThreadMember'

export default class ThreadMemberManager {
  public cache: Collection<Snowflake, ThreadMember> = new Collection()
}