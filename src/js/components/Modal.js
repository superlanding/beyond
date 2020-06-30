import noop from 'lodash.noop'
import supportDom from '../utils/supportDom'

@supportDom
export default class Modal {

  constructor(dom, options = {}) {
    this.dom = dom
    this.isVisible = false
    this.modalId = null
    this.options = options
    this.options.cancel = options.cancel || noop
    this.options.confirm = options.confirm || noop
    this.init()
  }

  init() {
    this.modalId = this.dom.dataset.modalOpener
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
    this.addEvent(this.dom, 'click', () => this.show())

    this.addEvent(this.closeBtn, 'click', () => {
      this.hide()
      this.options.cancel('close')
    })

    this.addEvent(this.cancelBtn, 'click', () => {
      this.hide()
      this.options.cancel('cancel')
    })

    this.addEvent(this.modal, 'click', event => {
      // is backdrop
      if (event.target.dataset.modal === this.modalId) {
        this.hide()
        this.options.cancel('backdrop')
      }
    })

    this.addEvent(this.confirmBtn, 'click', () => {
      if (typeof this.options.confirm === 'function') {
        this.options.confirm()
      }
      else {
        this.hide()
      }
    })
  }
}
