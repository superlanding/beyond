export default class Dropdown {

  constructor(dom) {
    this.dom = dom
    this.isMenuVisible = false
    this.init()
  }

  init() {
    this.dropdownToggle = this.dom.querySelector('[data-dropdown-toggle]')
    this.dropdownMenu = this.dom.querySelector('[data-dropdown-menu]')
    this.addEvents()
  }

  hideMenu() {
    this.dropdownMenu.style.display = 'none'
    this.isMenuVisible = false
  }

  toggleMenu() {
    this.dropdownMenu.style.display = this.isMenuVisible ? 'none' : 'block'
    this.isMenuVisible = (! this.isMenuVisible)
  }

  addEvents() {
    this._handleToggleClick = () => this.toggleMenu()
    this.dropdownToggle.addEventListener('click', this._handleToggleClick, false)
    this._handleBackdropClick = event => {
      if (! this.isMenuVisible) {
        return
      }
      if (event.target !== this.dropdownToggle) {
        this.hideMenu()
      }
    }
    document.addEventListener('click', this._handleBackdropClick, false)
  }

  destroy() {
    this.dropdownToggle.removeEventListener('click', this._handleToggleClick, false)
    document.removeEventListener('click', this._handleBackdropClick, false)
  }
}
