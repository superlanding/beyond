import throttle from 'lodash.throttle'
import getFloatedTargetPos from '../helpers/getFloatedTargetPos'
import toPixel from '../helpers/toPixel'
import supportDom from '../helpers/supportDom'

@supportDom
export default class Dropdown {

  constructor(dom) {
    this.dom = dom
    this.isMenuVisible = false
    this.init()
  }

  init() {
    this.id = this.dom.dataset.dropdown
    this.menu = document.querySelector(`[data-dropdown-menu="${this.id}"]`)
    this.menu.remove()
    this.addEvents()
  }

  hideMenu() {
    this.menu.remove()
    this.isMenuVisible = false
  }

  showMenu() {
    const { menu } = this
    menu.style.display = 'block'
    menu.style.opacity = 0
    document.body.append(menu)
    const pos = getFloatedTargetPos({
      src: this.dom,
      target: menu,
      place: menu.dataset.place || 'bottom',
      align: menu.dataset.align,
      offset: ('offset' in menu.dataset) ? menu.dataset.offset : 14
    })
    this.menu.style.opacity = 1
    this.menu.style.left = toPixel(pos.left)
    this.menu.style.top = toPixel(pos.top)
    this.isMenuVisible = true
  }

  toggleMenu() {
    return this.isMenuVisible ? this.hideMenu() : this.showMenu()
  }

  adjustMenuPos() {
    if (! this.isMenuVisible) {
      return
    }
    const { menu, dom } = this
    const pos = getFloatedTargetPos({
      src: dom,
      target: menu,
      place: menu.dataset.place,
      align: menu.dataset.align,
      offset: ('offset' in menu.dataset) ? menu.dataset.offset : 14
    })
    menu.style.left = toPixel(pos.left)
    menu.style.top = toPixel(pos.top)
  }

  addEvents() {
    this.addEvent(this.dom, 'click', () => this.toggleMenu())

    this.addEvent(document, 'click', event => {
      if (! this.isMenuVisible) {
        return
      }
      // is backdrop
      if ((event.target !== this.dom) && (! this.dom.contains(event.target))) {
        this.hideMenu()
      }
    })

    this.addEvent(window, 'resize', throttle(() => this.adjustMenuPos(), 300))
  }
}
