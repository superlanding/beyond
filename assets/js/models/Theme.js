import url from 'url'

const { $ } = window.beyond
const cacheKey = 'beyond-official::theme'
const linkId = 'beyond-theme-link'

class Theme {

  static set(theme) {
    localStorage.setItem(cacheKey, theme)
    Theme.setCssLink()
  }

  static get() {
    return localStorage.getItem(cacheKey) || 'default'
  }

  static findOrCreateLink() {
    const existedLink = $(linkId)
    if (existedLink) {
      return existedLink
    }
    const link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return link
  }

  static setCssLink() {
    const distMeta = $('meta[name="dist"]')
    if (! distMeta) {
      return
    }
    const versionMeta = $('meta[name="version"]')
    const theme = Theme.get()
    const dist = distMeta.getAttribute('content')
    let href = url.resolve(dist, `beyond-${theme}.css`)
    if (versionMeta) {
      href += `?v=${versionMeta.getAttribute('content')}`
    }
    const link = Theme.findOrCreateLink()
    link.href = href
  }
}

export default Theme
