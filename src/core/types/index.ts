export interface RcFile {
  commands: string[],
  aliases: { [K: string]: string }
  preloads: string[]
  statics: []
}

export interface BuildOption {
  MINIFY: boolean
  OUT_DIR: string
}