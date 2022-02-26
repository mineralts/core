import { EmbedField } from '../../../api/types'
import EmbedAuthor from './EmbedAuthor'
import EmbedImage from './EmbedImage'
import EmbedThumbnail from './EmbedThumbnail'
import { DateTime } from 'luxon'
import EmbedVideo from './EmbedVideo'
import EmbedFooter from './EmbedFooter'
import Color from '../../../api/entities/colors/index'

export default interface MessageEmbed {
  readonly title: string | undefined
  readonly description: string | undefined
  readonly color: keyof typeof Color
  readonly fields: EmbedField[]
  readonly author: EmbedAuthor | undefined
  readonly image: EmbedImage | undefined
  readonly thumbnail: EmbedThumbnail | undefined
  readonly timestamp: DateTime | undefined
  readonly video: EmbedVideo | undefined
  readonly url: string | undefined
  readonly footer: EmbedFooter | undefined

  setTitle (value: string): this
  setDescription (value: string): this
  setColor (color: keyof typeof Color | string): this
  addField (name: string, value: string, inline: boolean): this
  setAuthor (options: { name?: string, url?: string | null, icon_url?: string | null, proxy_icon_url?: string}): this
  setImage (options: { url?: string | null, proxy_url?: string }): this
  setThumbnail (options: { url?: string | null, proxy_url?: string }): this
  setTimestamp (): this
  setUrl (url: string): this
  setFooter (options: { text: string, iconUrl?: string | null, proxyIconUrl?: string }): this
}