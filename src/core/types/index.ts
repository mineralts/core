export interface RcFile {
  commands: string[],
  aliases: { [K: string]: string }
  preloads: string[]
  statics: []
}