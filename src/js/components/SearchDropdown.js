import noop from 'lodash.noop'
import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'
import getFloatedTargetPos from '../helpers/getFloatedTargetPos'
import toPixel from '../helpers/toPixel'
import supportDom from '../helpers/supportDom'
import getKey from '../helpers/getKey'

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
    this.place = 'bottom'
    this.align = 'left'
    this.isMenuVisible = false
    this.lastKeyword = null
    this.selectedIndex = 0
    this.items = []
    this.compositionStarted = false
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
    menu.className = 'search-dropdown dropdown-menu'

    const inputWrap = document.createElement('div')
    inputWrap.className = 'search-dropdown-input-wrap'

    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'input search-dropdown-input'

    inputWrap.appendChild(input)

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
  }

  showMenu() {
    const { input, menu } = this
    this.getData(input.value)
    menu.style.display = 'block'
    menu.style.opacity = 0
    menu.style.transform = 'scale(.8)'
    document.body.appendChild(menu)
    this.adjustMenuPos()
    menu.style.transform = 'scale(1)'
    menu.style.opacity = 1
    this.isMenuVisible = true
    this.input.focus()
  }

  toggleMenu() {
    return this.isMenuVisible ? this.hideMenu() : this.showMenu()
  }

  adjustMenuPos() {
    const { menu, dom } = this
    const { dataset } = menu
    const offsetLeft = ('offsetLeft' in dataset) ? parseInt(dataset.offsetLeft, 10) : 0
    const offsetTop = ('offsetTop' in dataset) ? parseInt(dataset.offsetTop, 10) : 0

    const { pos, place, align } = getFloatedTargetPos({
      src: dom,
      target: menu,
      place: this.place,
      align: this.align,
      offset: parseInt(dom.dataset.offset, 10) || 14,
      offsetLeft,
      offsetTop
    })
    dataset.place = place
    dataset.align = align
    menu.style.left = toPixel(pos.left)
    menu.style.top = toPixel(pos.top)
  }

  renderMenu() {
    const { menuContent, items } = this
    menuContent.innerHTML = items.map((item, i) => {
      return this.options.renderItem(item, i, (this.selectedIndex === i))
    })
      .join('')
    this.setMenuContentActive(items.length > 0)

    const menuItemEls = this.getMenuItemEls()
    const selectedEl = menuItemEls[this.selectedIndex]
    if (selectedEl) {
      const scrollTop = menuContent.scrollTop
      const contentTop = menuContent.offsetTop
      const contentBottom = contentTop + menuContent.offsetHeight
      const elHeight = selectedEl.offsetHeight
      const elTop = selectedEl.offsetTop - scrollTop
      const elBottom = elTop + elHeight

      if (elTop < contentTop) {
        this.menuContent.scrollTop -= elHeight
      }
      else if (elBottom > contentBottom) {
        this.menuContent.scrollTop += elHeight
      }
    }
  }

  setItems(items) {
    this.items = items
    this.renderMenu()
  }

  async getData(keyword) {
    this.lastKeyword = keyword
    const items = await this.options.getData(keyword)

    if (this.lastKeyword === this.input.value) {
      this.setItems(items)
    }
  }

  getMenuItemEls() {
    return Array.from(this.menuContent.querySelectorAll('[data-item]'))
  }

  findClickedItem(target, parent) {
    const rows = this.getMenuItemEls()
    let node = target
    while (node.parentNode !== parent) {
      if ('item' in node.dataset) {
        const index = rows.findIndex(row => row === node)
        return this.items[index]
      }
      node = node.parentNode
    }
    return null
  }

  isInputFocused() {
    return document.activeElement === this.input
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
    }, 500))
    this.addEvent(this.input, 'compositionstart', () => {
      this.compositionStarted = true
    })
    this.addEvent(this.input, 'compositionend', () => {
      this.compositionStarted = false
    })

    this.addEvent(this.dom, 'click', () => this.toggleMenu())

    this.addEvent(document, 'click', event => {
      if (! this.isMenuVisible) {
        return
      }
      const isBackdrop = (event.target !== this.dom) &&
        (! this.dom.contains(event.target)) &&
        (! this.menu.contains(event.target))

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
  }
}
