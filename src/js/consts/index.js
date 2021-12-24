import locale from 'date-fns/locale/zh-TW'

export const DEFAULT_TIMEZONE = 'Asia/Taipei'

export const DEFAULT_LOCALE = locale

export const THEME_DEFAULT = 'default'

export const THEME_DARK = 'dark'

export const THEMES = [
  { text: 'Default', value: THEME_DEFAULT },
  { text: 'Dark', value: THEME_DARK }
]

export const CHART_STYLE = {
  [THEME_DEFAULT]: {
    bg: '#fff',
    txt: '#3c4257',
    line: 'rgba(224, 224, 224, .5)',
    glowAlpha: .2,
    variants: [
      '#5469d4',
      '#7c54d4',
      '#a254d4',
      '#c040a2',
      '#ff5604',
      '#0be4e3',
      '#00d924'
    ]
  },
  [THEME_DARK]: {
    bg: '#000',
    txt: '#fff',
    line: 'rgba(255, 255, 255, .3)',
    glowAlpha: .3,
    variants: [
      '#769aff',
      '#9e72ff',
      '#c66cff',
      '#ff5ed9',
      '#ff5604',
      '#0be4e3',
      '#00d924'
    ]
  }
}

export const DEFAULT_CHART_STYLES = [
  '#5469d4',
  '#7c54d4',
  '#a254d4',
  '#c040a2',
  '#ff5604',
  '#0be4e3',
  '#00d924'
]
