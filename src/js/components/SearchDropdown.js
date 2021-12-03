import getFloatedTargetPos from '../utils/getFloatedTargetPos'
import supportDom from '../decorators/supportDom'
import getKey from '../utils/getKey'
import { debounce, noop, toPixel, throttle } from '../utils'

const renderMenu = row => {
  return `<div class="search-dropdown-menu-item" data-item>${JSON.stringify(row)}</div>`
}

const itemClick = row => JSON.stringify(row)

@supportDom
export default class SearchDropdown {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
    this.options.getData = options.getData || noop
    this.options.renderMenu = options.renderMenu || renderMenu
    this.options.itemClick = options.itemClick || itemClick
    this.options.change = options.change || noop
    this.options.wait = options.wait || 50
    this.place = options.place || 'bottom'
    this.align = options.align || 'left'
    this.offset = options.offset || 14
    this.offsetTop = options.offsetTop || 0
    this.offsetLeft = options.offsetLeft || 0
    this.noDataMsg = options.noDataMsg || '沒有資料'
    this.getFloatedTargetPos = options.getFloatedTargetPos || getFloatedTargetPos
    this.isMenuVisible = false
    this.lastKeyword = null
    this.selectedIndex = 0
    this.items = []
    this.compositionStarted = false
    this.compositionJustEnded = false
    this.loading = true
    this.init()
  }

  init() {
    this.initTextNode()
    this.appendMenu()
    this.addEvents()
  }

  initTextNode() {
    this.textNode = Array.from(this.dom.childNodes)
      .find(node => node.nodeType === Node.TEXT_NODE)
    if (this.textNode) {
      this.headSpaces = this.textNode.textContent.match(/^\s+/) || ''
      this.tailSpaces = this.textNode.textContent.match(/\s+$/) || ''
    }
  }

  setText(value) {
    if (this.textNode) {
      this.textNode.textContent = `${this.headSpaces}${value}${this.tailSpaces}`
    }
  }

  appendMenu() {

    const menu = document.createElement('div')
    const { dataset } = menu

    dataset.place = this.place
    dataset.align = this.align
    dataset.offset = this.offset
    dataset.offsetTop = this.offsetTop
    dataset.offsetLeft = this.offsetLeft

    menu.className = 'search-dropdown dropdown-menu'

    const inputWrap = document.createElement('div')
    inputWrap.className = 'search-dropdown-input-wrap'

    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'input search-dropdown-input'

    inputWrap.appendChild(input)

    const loader = document.createElement('div')
    loader.className = 'search-dropdown-loader'

    loader.innerHTML = `
      <div class="fb-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    `

    inputWrap.appendChild(loader)

    if (this.options.placeholder) {
      input.setAttribute('placeholder', this.options.placeholder)
    }
    const menuContent = document.createElement('div')
    menuContent.className = 'search-dropdown-menu'
    menu.appendChild(inputWrap)
    menu.appendChild(menuContent)

    this.menu = menu
    this.input = input
    this.menuContent = menuContent
    this.loader = loader
  }

  setLoading(loading) {
    this.loading = loading

    if (loading) {
      this.input.classList.add('loading')
      this.loader.style.display = 'block'
    }
    else {
      this.input.classList.remove('loading')
      this.loader.style.display = 'none'
    }
  }

  setMenuContentActive(active) {
    if (active) {
      return this.menuContent.classList.add('active')
    }
    this.menuContent.classList.remove('active')
  }

  hideMenu() {
    const { menu } = this
    menu.style.transform = 'scale(.8)'
    menu.style.opacity = 0
    setTimeout(() => menu.remove(), 300)

    // recover
    menu.dataset.place = this.place
    menu.dataset.align = this.align
    this.isMenuVisible = false
    this.lastKeyword = null
  }

  showMenu() {
    const { input, menu } = this
    this.getData(input.value)

    menu.style.display = 'block'
    menu.style.opacity = 0
    menu.style.transform = 'scale(.8)'
    document.body.appendChild(menu)

    setTimeout(() => {
      this.adjustMenuPos()
      menu.style.transform = 'scale(1)'
      menu.style.opacity = 1
      this.isMenuVisible = true
      this.input.focus()
    }, 0)
  }

  toggleMenu() {
    return this.isMenuVisible ? this.hideMenu() : this.showMenu()
  }

  adjustMenuPos() {
    const { menu, dom, offset, offsetLeft, offsetTop } = this
    const { pos, place, align } = this.getFloatedTargetPos({
      src: dom,
      target: menu,
      place: this.place,
      align: this.align,
      offset,
      offsetLeft,
      offsetTop
    })
    menu.dataset.place = place
    menu.dataset.align = align
    menu.style.left = toPixel(pos.left)
    menu.style.top = toPixel(pos.top)
  }

  renderMenu() {
    const { menuContent, items, selectedIndex } = this
    const { renderItem } = this.options

    let menuItems = items.map((item, i) => {
      return renderItem(item, i, (selectedIndex === i), items)
    })

    if (menuItems.length === 0) {
      menuItems = [`<div class="search-dropdown-menu-item">${this.noDataMsg}</div>`]
    }

    menuContent.innerHTML = menuItems.join('')

    this.setMenuContentActive(items.length > 0)

    const menuItemEls = this.getMenuItemEls()
    const selectedEl = menuItemEls[selectedIndex]
    if (selectedEl) {
      const scrollTop = menuContent.scrollTop
      const contentTop = menuContent.offsetTop
      const contentBottom = contentTop + menuContent.offsetHeight
      const elHeight = selectedEl.offsetHeight
      const elTop = selectedEl.offsetTop - scrollTop
      const elBottom = elTop + elHeight

      if (elTop < contentTop) {
        menuContent.scrollTop -= elHeight
      }
      else if (elBottom > contentBottom) {
        menuContent.scrollTop += elHeight
      }
    }
  }

  setItems(items) {
    this.items = items
    this.renderMenu()
  }

  async getData(keyword) {
    if (this.lastKeyword === keyword) {
      return
    }
    this.resetSelectedIndex()
    this.lastKeyword = keyword
    this.setItems([])

    this.setLoading(true)

    const items = await this.options.getData(keyword)

    this.setLoading(false)

    if (this.lastKeyword === this.input.value) {
      this.setItems(items)
    }
  }

  getMenuItemEls() {
    return Array.from(this.menuContent.querySelectorAll('[data-item]'))
  }

  findClickedItem(target) {
    const index = this.getMenuItemEls()
      .findIndex(item => (target === item) || (item.contains(target)))
    return this.items[index]
  }

  isInputFocused() {
    return document.activeElement === this.input
  }

  resetSelectedIndex() {
    this.selectedIndex = 0
  }

  selectPrevItem() {
    if (this.items.length === 0) {
      return
    }
    if (this.selectedIndex > 0) {
      this.selectedIndex -= 1
      this.renderMenu()
    }
  }

  selectNextItem() {
    const { length } = this.items
    if (length === 0) {
      return
    }
    if ((this.selectedIndex + 1) < (length - 1)) {
      this.selectedIndex += 1
      this.renderMenu()
    }
  }

  setItem(item) {
    this.setText(this.options.itemClick(item))
    this.hideMenu()
    this.options.change(item)
  }

  setCurrentItem() {
    const item = this.items[this.selectedIndex]
    if (item) {
      this.setItem(item)
    }
  }

  handleEscKey() {
    if (this.isInputFocused()) {
      this.input.blur()
    }
    else {
      this.hideMenu()
    }
  }

  addEvents() {

    this.addEvent(this.menuContent, 'click', event => {
      const item = this.findClickedItem(event.target)
      if (item) {
        event.preventDefault()
        event.stopPropagation()
        this.setItem(item)
      }
    })
    this.addEvent(this.input, 'focus', () => {
      this.renderMenu()
    })

    this.addEvent(this.input, 'keyup', debounce(event => {
      if (this.compositionStarted) {
        return
      }
      this.getData(event.target.value)
    }, this.options.wait))

    this.addEvent(this.input, 'compositionstart', () => {
      this.compositionStarted = true
    })

    this.addEvent(this.input, 'compositionend', () => {
      this.compositionJustEnded = true
      this.compositionStarted = false
    })

    this.addEvent(this.dom, 'click', () => this.toggleMenu())

    this.addEvent(document, 'click', event => {
      if (! this.isMenuVisible) {
        return
      }
      const { target } = event
      const isBackdrop = (target !== this.dom) &&
        (! this.dom.contains(target)) &&
        (! this.menu.contains(target))

      if (isBackdrop) {
        this.hideMenu()
      }
    })

    this.addEvent(document, 'keydown', event => {
      const key = getKey(event)
      if (this.isMenuVisible && ['up', 'down'].includes(key)) {
        event.preventDefault()
      }
    })

    this.addEvent(document, 'keyup', event => {
      if (this.compositionStarted) {
        return
      }
      if (! this.isMenuVisible) {
        return
      }
      const key = getKey(event)

      if (key === 'esc') {
        return this.handleEscKey()
      }
      if (key === 'up') {
        return this.selectPrevItem()
      }
      if (key === 'down') {
        return this.selectNextItem()
      }
      // workaround to block composition ended with enter key
      if ((key === 'enter') && this.compositionJustEnded) {
        this.compositionJustEnded = false
        return
      }
      if (key === 'enter') {
        return this.setCurrentItem()
      }
    })

    this.addEvent(window, 'resize', throttle(() => {
      if (! this.isMenuVisible) {
        return
      }
      this.adjustMenuPos()
    }, 300))
  }

  destroy() {
    this.menu.remove()
    this.menu = null
    this.input = null
    this.menuContent = null
    this.loader = null
  }
}
