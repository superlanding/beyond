import getFloatedTargetPos from '../utils/getFloatedTargetPos'
import supportDom from '../decorators/supportDom'
import { isFunction, toPixel, throttle } from '../utils'

@supportDom
export default class Dropdown {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
    this.isMenuVisible = false
    this.place = null
    this.align = null
    this.defaultTextNode = this.getDefaultTextNode(dom, options.textIndex)
    this.defaultText = this.defaultTextNode ? this.defaultTextNode.textContent.trim() : ''
    this.backdropMode = options.backdropMode || 'auto'
    this.init()
  }

  restoreText() {
    if (this.defaultTextNode) {
      this.defaultTextNode.textContent = this.defaultText
    }
  }

  setText(text) {
    if (this.defaultTextNode) {
      this.defaultTextNode.textContent = text
    }
  }

  getDefaultTextNode(dom, index = 0) {
    return dom.childNodes[index]
  }

  init() {

    if (! this.dom) {
      throw new Error('dom is missing in Dropdown class')
    }

    this.id = this.dom.dataset.target
    this.menu = document.querySelector(`[data-dropdown-menu="${this.id}"]`)

    if (! this.menu) {
      throw new Error(`menu ${this.id} is missing in Dropdown class`)
    }
    this.place = this.menu.dataset.place || 'bottom'
    this.align = this.menu.dataset.align
    this.menu.remove()
    this.addEvents()
  }

  restoreMenuAttrs() {
    const { menu, place, align } = this
    if (place) {
      menu.dataset.place = place
    }
    if (align) {
      menu.dataset.align = align
    }
  }

  hideMenu(immediate = false) {
    const { menu } = this
    menu.style.transform = 'scale(.8)'
    menu.style.opacity = 0

    if (immediate) {
      menu.remove()
    }
    else {
      setTimeout(() => menu.remove(), 300)
    }
    this.restoreMenuAttrs()
    this.isMenuVisible = false
  }

  showMenu() {
    const { menu } = this
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
    const offset = ('offset' in dataset) ? parseInt(dataset.offset, 10) : 14
    const offsetLeft = ('offsetLeft' in dataset) ? parseInt(dataset.offsetLeft, 10) : 0
    const offsetTop = ('offsetTop' in dataset) ? parseInt(dataset.offsetTop, 10) : 0

    const { pos, place, align } = getFloatedTargetPos({
      src: dom,
      target: menu,
      place: this.place,
      align: this.align,
      offset,
      offsetLeft,
      offsetTop
    })
    dataset.place = place
    dataset.align = align
    menu.style.left = toPixel(pos.left)
    menu.style.top = toPixel(pos.top)
  }

  addEvents() {

    const { menuMouseOver, menuMouseLeave, menuClick } = this.options

    if (isFunction(menuMouseOver)) {
      this.addEvent(this.menu, 'mouseover', event => menuMouseOver(event))
    }

    if (isFunction(menuMouseLeave)) {
      this.addEvent(this.menu, 'mouseleave', event => menuMouseLeave(event))
    }

    if (isFunction(menuClick)) {
      this.addEvent(this.menu, 'click', event => {
        const { dataset } = event.target
        if ('dropdownItem' in dataset) {
          menuClick(event)
        }
      })
    }

    this.addEvent(this.dom, 'click', () => this.toggleMenu())

    this.addEvent(document, 'click', event => {
      if (! this.isMenuVisible) {
        return
      }
      if (this.backdropMode === 'manual') {
        return
      }
      // is backdrop
      if ((event.target !== this.dom) && (! this.dom.contains(event.target))) {
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
    // prevent next re-bind error
    const { menu } = this
    if (menu) {
      this.hideMenu(true)
      document.body.appendChild(menu)
    }
  }
}
