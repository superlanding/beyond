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
    const oldHref = link.getAttribute('href')
    const search = url.parse(oldHref).search || ''
    const filename = `beyond-${theme}.css` + search
    const href = url.resolve(oldHref, filename)
    link.href = href
  }
}

export default Theme
