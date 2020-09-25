import supportDom from '../decorators/supportDom'
import { noop } from '../utils'

let globalModalId = 0

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
    this.bindEvents()
  }

  bindEvents() {
    this.setModalDom()
    this.closeBtn = this.modal.querySelector('[data-close]')
    this.cancelBtn = this.modal.querySelector('[data-cancel]')
    this.confirmBtn = this.modal.querySelector('[data-confirm]')
    this.addEvents()
  }

  setModalDom() {
    const { modalOpener, modal } = this.dom.dataset

    if (modalOpener) {
      this.modalId = this.dom.dataset.modalOpener
      const selector = `[data-modal="${this.modalId}"]`
      this.modal = document.querySelector(selector)
      return
    }

    if (modal) {
      this.modalId = modal
    }
    else {
      this.modalId = `modal-${++globalModalId}`
      this.dom.dataset.modal = this.modalId
    }
    this.modal = this.dom
  }

  show(html) {
    if (html) {
      this.replace(html)
    }
    this.isVisible = true
    this.modal.style.display = 'block'
    setTimeout(() => {
      this.modal.classList.add('js-active')
      if (typeof $ === 'function') {
        $(this.dom).trigger('beyond.modal.show')
      }
    }, 50)
  }

  hide() {
    this.isVisible = false
    this.modal.classList.remove('js-active')
    setTimeout(() => {
      this.modal.style.display = 'none'
      if (typeof $ === 'function') {
        $(this.dom).trigger('beyond.modal.hide')
      }
    }, 300)
  }

  replace(html) {
    this.destroy()
    this.modalId = null

    // replace with new dom
    const div = document.createElement('div')
    div.innerHTML = html.trim()
    const dom = div.firstChild

    // keep the id that is created by $.uniqModal()
    const originalDomId = this.dom.id
    if (originalDomId === 'beyond-uniq-modal') {
      dom.id = originalDomId
    }

    this.dom.parentNode.replaceChild(dom, this.dom)

    this.dom = dom
    this.dom._modal = this
    this.init()
  }

  visible() {
    return this.isVisible
  }

  addEventIfDomExists(dom, event, cb) {
    if (dom) {
      this.addEvent(dom, event, cb)
    }
  }

  addEvents() {
    if (this.dom.dataset.modalOpener) {
      this.addEventIfDomExists(this.dom, 'click', () => this.show())
    }

    this.addEventIfDomExists(this.closeBtn, 'click', () => {
      this.hide()
      this.options.cancel('close')
    })

    this.addEventIfDomExists(this.cancelBtn, 'click', () => {
      this.hide()
      this.options.cancel('cancel')
    })

    this.addEventIfDomExists(this.modal, 'click', event => {
      // is backdrop
      if (event.target.dataset.modal === this.modalId) {
        this.hide()
        this.options.cancel('backdrop')
      }
    })

    this.addEventIfDomExists(this.confirmBtn, 'click', () => {
      if (typeof this.options.confirm === 'function') {
        this.options.confirm()
      }
      else {
        this.hide()
      }
    })
  }
}
