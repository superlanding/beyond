export default class Modal {

  constructor(dom, options = {}) {
    this.dom = dom
    this.isVisible = false
    this.modalId = null
    this.options = options
    this.init()
  }

  init() {
    this.modalId = this.dom.dataset.modalToggler
    const selector = `[data-modal="${this.modalId}"]`
    this.modal = document.querySelector(selector)
    if (! this.modal) {
      throw new Error(`${selector} is not defined.`)
    }
    this.closeBtn = this.modal.querySelector('[data-close]')
    this.cancelBtn = this.modal.querySelector('[data-cancel]')
    this.confirmBtn = this.modal.querySelector('[data-confirm]')
    this.addEvents()
  }

  show() {
    this.isVisible = true
    this.modal.style.display = 'block'
    setTimeout(() => {
      this.modal.classList.add('js-active')
    }, 50)
  }

  hide() {
    this.isVisible = false
    this.modal.classList.remove('js-active')
    setTimeout(() => {
      this.modal.style.display = 'none'
    }, 300)
  }

  addEvents() {
    this._handleTogglerClick = this.show.bind(this)
    this.dom.addEventListener('click', this._handleTogglerClick, false)

    this._handleCloseBtnClick = () => {
      this.hide()
      if (typeof this.options.cancel === 'function') {
        this.options.cancel('close')
      }
    }
    this.closeBtn.addEventListener('click', this._handleCloseBtnClick, false)

    this._handleCancelBtnClick = () => {
      this.hide()
      if (typeof this.options.cancel === 'function') {
        this.options.cancel('cancel')
      }
    }
    this.cancelBtn.addEventListener('click', this._handleCancelBtnClick, false)

    this._handleModalClick = event => {
      // is backdrop
      if (event.target.dataset.modal === this.modalId) {
        this.hide()
        if (typeof this.options.cancel === 'function') {
          this.options.cancel('backdrop')
        }
      }
    }
    this.modal.addEventListener('click', this._handleModalClick, false)

    this._handleConfirmBtnClick = () => {
      if (typeof this.options.confirm === 'function') {
        this.options.confirm()
      }
      else {
        this.hide()
      }
    }
    this.confirmBtn.addEventListener('click', this._handleConfirmBtnClick, false)
  }

  destroy() {
    this.dom.removeEventListener('click', this._handleTogglerClick, false)
    this.closeBtn.removeEventListener('click', this._handleCloseBtnClick, false)
    this.cancelBtn.removeEventListener('click', this._handleCancelBtnClick, false)
    this.modal.removeEventListener('click', this._handleModalClick, false)
    this.confirmBtn.removeEventListener('click', this._handleConfirmBtnClick, false)
  }
}
