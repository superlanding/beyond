import getFloatedTargetPos from '../helpers/getFloatedTargetPos'
import toPixel from '../helpers/toPixel'

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

  addEvents() {
    this._handleClick = () => this.toggleMenu()
    this.dom.addEventListener('click', this._handleClick, false)
    this._handleBackdropClick = event => {
      if (! this.isMenuVisible) {
        return
      }
      if ((event.target !== this.dom) && (! this.dom.contains(event.target))) {
        this.hideMenu()
      }
    }
    document.addEventListener('click', this._handleBackdropClick, false)
  }

  destroy() {
    this.dom.removeEventListener('click', this._handleClick, false)
    document.removeEventListener('click', this._handleBackdropClick, false)
  }
}
