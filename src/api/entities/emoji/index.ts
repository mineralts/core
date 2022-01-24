import { Snowflake } from '../../types'
import Role from '../roles'

export default class Emoji {
  constructor (
    public id: Snowflake,
    public label: string,
    public managed: boolean,
    public available: boolean,
    public animated: boolean = false,
    public roles: Role[] = [],
  ) {
  }
}