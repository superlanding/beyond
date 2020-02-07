import noop from 'lodash.noop'
import throttle from 'lodash.throttle'
import getFloatedTargetPos from '../helpers/getFloatedTargetPos'
import toPixel from '../helpers/toPixel'
import supportDom from '../helpers/supportDom'

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

  hideMenu() {
    const { menu, menuContent } = this
    menuContent.classList.remove('active')
    menu.style.transform = 'scale(.8)'
    menu.style.opacity = 0
    setTimeout(() => menu.remove(), 300)

    // recover
    menu.dataset.place = this.place
    menu.dataset.align = this.align
    this.isMenuVisible = false
  }

  showMenu() {
    const { input, menu, menuContent } = this
    this.getData(input.value)
    menuContent.classList.add('active')
    menu.style.display = 'block'
    menu.style.opacity = 0
    menu.style.transform = 'scale(.8)'
    document.body.appendChild(menu)
    this.adjustMenuPos()
    menu.style.transform = 'scale(1)'
    menu.style.opacity = 1
    this.isMenuVisible = true
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
    this.menuContent.innerHTML = this.items.map(this.options.renderItem).join('')
  }

  async getData(keyword) {
    this.items = await this.options.getData(keyword)
    this.renderMenu()
  }

  findClickedItem(target, parent) {
    const rows = Array.from(this.menuContent.querySelectorAll('[data-item]'))
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

  addEvents() {

    this.addEvent(this.menuContent, 'click', event => {
      const item = this.findClickedItem(event.target)
      if (item) {
        this.setText(this.options.itemClick(item))
        this.hideMenu()
        this.options.change(item)
      }
    })

    this.addEvent(this.input, 'keyup', event => {
      if (this.compositionStarted) {
        return
      }
      const isEnter = (event.keyCode === 13)
      if (isEnter) {
        this.getData(event.target.value)
      }
    })
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
