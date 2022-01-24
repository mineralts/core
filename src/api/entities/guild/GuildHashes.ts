import { Hash } from '../../types'

export default class GuildHashes {
  constructor (
    public roles: Hash,
    public metadata: Hash,
    public channels: Hash,
  ) {
  }
}