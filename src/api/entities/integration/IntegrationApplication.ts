import User from '../user'

export default class IntegrationApplication {
  constructor (
    public id: string,
    public name: string,
    public description: string,
    public icon: string | undefined,
    public summary: string,
    public bot: User,
  ) {
  }
}