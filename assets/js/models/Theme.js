import url from 'url'

const { $ } = window.beyond
const cacheKey = 'beyond-official::theme'

class Theme {

  static set(theme) {
    localStorage.setItem(cacheKey, theme)
    Theme.setCssLink()
  }

  static get() {
    return localStorage.getItem(cacheKey) || 'default'
  }

  static setCssLink() {
    const link = $('#beyond-theme-link')
    if (! link) {
      return
    }
    const theme = Theme.get()
    const filename = `beyond-${theme}.css`
    const parts = url.parse(link.getAttribute('href'))
    const search = parts.search || ''
    const href = [parts.protocol, '//', parts.host, '/', filename, search].join('')
    link.href = href
  }
}

export default Theme
