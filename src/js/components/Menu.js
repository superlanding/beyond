import supportDom from '../decorators/supportDom'

@supportDom
export default class Menu {

  constructor(dom) {
    this.dom = dom
    this.visible = ('defaultVisible' in dom.dataset) || false
    this.init()
  }

  init() {
    this.id = this.dom.dataset.menuToggle
    this.menu = document.querySelector(`[data-menu="${this.id}"]`)
    this.addEvents()

    if (this.visible) {
      this.showMenu()
    }
  }

  showMenu() {
    this.visible = true
    this.dom.classList.add('js-opened')
    this.menu.classList.add('js-opened')
    this.menu.style.display = 'block'
  }

  hideMenu() {
    this.visible = false
    this.dom.classList.remove('js-opened')
    this.menu.classList.remove('js-opened')
    this.menu.style.display = 'none'
  }

  toggleMenu() {
    this.visible ? this.hideMenu() : this.showMenu()
  }

  addEvents() {
    this.addEvent(this.dom, 'click', () => this.toggleMenu())
  }
}
