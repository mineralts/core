import { DateTime } from 'luxon'

export default class RateLimit {
  constructor (
    public message: string,
    public retryAfter: DateTime,
    private global: boolean,
  ) {
  }

  public isGlobal (): boolean {
    return this.global
  }
}