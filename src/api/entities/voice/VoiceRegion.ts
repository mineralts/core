export default class VoiceRegion {
  constructor (
    public id: string,
    public name: string,
    public optimal: boolean,
    public custom: boolean,
    public deprecated: boolean,
  ) {
  }

  public isOptimal (): boolean {
    return this.optimal
  }

  public isCustom (): boolean {
    return this.custom
  }

  public isDeprecated (): boolean {
    return this.deprecated
  }
}