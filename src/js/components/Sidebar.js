import supportDom from '../utils/supportDom'

@supportDom
export default class Sidebar {

  constructor(dom) {
    this.btn = dom
    this.sidebar = document.querySelector(`[data-sidebar="${dom.dataset.sidebarOpener}"]`)
    this.isVisible = false
    this.init()
  }

  init() {
    this.addBackdrop()
    this.addEvents()
  }

  addBackdrop() {
    if (this.backdrop) {
      return
    }
    const backdrop = document.createElement('div')
    backdrop.className = 'backdrop'
    document.body.appendChild(backdrop)
    this.backdrop = backdrop
  }

  showBackdrop() {
    this.backdrop.classList.add('opened')
  }

  hideBackdrop() {
    this.backdrop.classList.remove('opened')
  }

  show() {
    this.showBackdrop()
    this.sidebar.classList.add('opened')
    this.isVisible = true
  }

  hide() {
    this.hideBackdrop()
    this.sidebar.classList.remove('opened')
    this.isVisible = false
  }

  addEvents() {
    this.addEvent(this.btn, 'click', () => this.show())
    this.addEvent(this.backdrop, 'click', () => this.hide())
  }

  destroy() {
    this.backdrop.remove()
  }
}
