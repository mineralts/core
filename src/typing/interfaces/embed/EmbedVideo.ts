export default interface EmbedVideo {
  readonly url: string | null | undefined
  readonly proxy_url: string | null | undefined
  readonly height?: number
  readonly width?: number
}