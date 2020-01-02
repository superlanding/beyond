import throttle from 'lodash.throttle'
import getFloatedTargetPos from '../helpers/getFloatedTargetPos'
import toPixel from '../helpers/toPixel'
import supportDom from '../helpers/supportDom'

@supportDom
export default class Dropdown {

  constructor(dom) {
    this.dom = dom
    this.isMenuVisible = false
    this.place = null
    this.align = null
    this.init()
  }

  init() {
    this.id = this.dom.dataset.dropdown
    this.menu = document.querySelector(`[data-dropdown-menu="${this.id}"]`)
    this.place = this.menu.dataset.place || 'bottom'
    this.align = this.menu.dataset.align
    this.menu.remove()
    this.addEvents()
  }

  hideMenu() {
    this.menu.remove()
    // recover
    this.menu.dataset.place = this.place
    this.menu.dataset.align = this.align
    this.isMenuVisible = false
  }

  showMenu() {
    const { menu } = this
    menu.style.display = 'block'
    menu.style.opacity = 0
    document.body.append(menu)
    this.adjustMenuPos()
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

    this.addEvent(window, 'resize', throttle(() => {
      if (! this.isMenuVisible) {
        return
      }
      this.adjustMenuPos()
    }, 300))
  }
}
