import { ChannelTypeResolvable, OptionType } from '../types'

export function resolveColor(color) {

  if (typeof color === 'string') {
    if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1))
    if (color === 'DEFAULT') return 0

    color = parseInt(color.replace('#', ''), 16)
  }

  if (color < 0 || color > 0xffffff) throw new RangeError('COLOR_RANGE')
  else if (Number.isNaN(color)) throw new TypeError('COLOR_CONVERT')

  return color
}

export function keyFromEnum<Enum> (entryEnum: Enum, payload: any): keyof Enum {
  return Object.keys(entryEnum)[Object.values(entryEnum).indexOf(payload)] as any
}

export function parseEmoji(text: string): any {
  if (text.includes('%')) text = decodeURIComponent(text)
  if (!text.includes(':')) return { name: text, id: null }
  const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/)
  return match && { animated: Boolean(match[1]), name: match[2], id: match[3] ?? null }
}

export function serializeCommand (command) {
  return {
    name: command.label,
    description: command.description,
    options: walk(command.options),
  }

  function walk (item) {
    return item.map((option) => {
      return {
        type: OptionType[option.type],
        name: option.name,
        description: option.description,
        required: option.required,
        choices: option.choices,
        min_value: option.min,
        max_value: option.max,
        autocomplete: OptionType[option.type] !== 'CHOICE' && option.autocomplete,
        channel_types: option.channelType
          ? option.channelType.map((channel) => ChannelTypeResolvable[channel])
          : undefined,
        options: option.options
          ? walk(option.options)
          : undefined
      }
    })
  }
}