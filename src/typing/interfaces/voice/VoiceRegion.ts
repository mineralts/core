export default interface VoiceRegion {
  readonly id: string
  readonly name: string
  readonly optimal: boolean
  readonly custom: boolean
  readonly deprecated: boolean

  isOptimal (): boolean
  isCustom (): boolean
  isDeprecated (): boolean
}