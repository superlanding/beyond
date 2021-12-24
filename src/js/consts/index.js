import locale from 'date-fns/locale/zh-TW'

export const DEFAULT_TIMEZONE = 'Asia/Taipei'

export const DEFAULT_LOCALE = locale

export const THEME_DEFAULT = 'default'

export const THEME_DARK = 'dark'

export const THEMES = [
  { text: 'Default', value: THEME_DEFAULT },
  { text: 'Dark', value: THEME_DARK }
]

export const DEFAULT_CHART_STYLES = [
  '#5469d4',
  '#7c54d4',
  '#a254d4',
  '#c040a2',
  '#ff5604',
  '#0be4e3',
  '#00d924'
]
