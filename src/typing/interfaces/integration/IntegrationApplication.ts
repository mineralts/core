import User from '../user'

export default interface IntegrationApplication {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly icon: string | undefined
  readonly summary: string
  readonly bot: User
}