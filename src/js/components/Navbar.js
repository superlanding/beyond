import supportDom from '../helpers/supportDom'

@supportDom
export default class Navbar {

  constructor(dom) {
    this.dom = dom
    this.isMenuVisible = false
    this.init()
  }

  init() {
    const { dom } = this
    this.btn = dom.querySelector('[data-toggle]')
    this.menu = dom.querySelector('[data-menu]')
    this.addEvents()
  }

  hideMenu() {
    this.btn.classList.remove('js-active')
    this.menu.classList.remove('js-collapse')
    this.isMenuVisible = false
  }

  showMenu() {
    this.btn.classList.add('js-active')
    this.menu.classList.add('js-collapse')
    this.isMenuVisible = true
  }

  toggleMenu() {
    return this.isMenuVisible ? this.hideMenu() : this.showMenu()
  }

  addEvents() {
    this.addEvent(this.btn, 'click', () => this.toggleMenu())
  }
}
