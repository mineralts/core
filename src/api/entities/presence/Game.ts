import { DateTime } from 'luxon'

export default class Game {
  constructor (
    public type: number,
    public timestamps: { start?: DateTime, end?: DateTime },
    public state: string,
    public sessionId: string,
    public party: any,
    public name: string,
    public id: string,
    public details: string,
    public created_at: DateTime,
    public assets: {
      smallText: string,
      smallImage: string,
      largeText: string,
      largeImage: string
    },
    public applicationId: string
  ) {
  }
}