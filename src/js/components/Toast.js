import supportDom from '../helpers/supportDom'

@supportDom
class ToastItem {

  constructor(options = {}) {
    this.options = options
    this.init()
  }

  init() {

    const { message, btnText, btnCb } = this.options
    const dom = document.createElement('div')
    dom.classList.add('toast-item')
    dom.style.transform = 'translateY(200%)'
    dom.style.opacity = 0

    const toastMessage = document.createElement('div')
    toastMessage.classList.add('toast-message')
    toastMessage.innerHTML = message

    dom.appendChild(toastMessage)

    this.dom = dom

    if (btnText) {
      this.createBtn(btnText)
    }
    if (btnText && btnCb) {
      this.createBtnCb()
    }
  }

  show() {
    const { dom } = this
    dom.style.transform = 'translateY(0)'
    dom.style.opacity = 1
  }

  createBtn() {
    const btn = document.createElement('button')
    btn.classList.add('toast-btn')
    btn.innerText = this.options.btnText
    this.dom.appendChild(btn)
    this.btn = btn
  }

  createBtnCb() {
    this.addEvent(this.btn, 'click', () => {
      this.options.btnCb({
        clear: () => {
          this.destroy()
        }
      })
    })
  }

  destroy() {
    const { dom } = this
    clearTimeout(dom._timer)
    dom.remove()
  }
}

export default class Toast {

  constructor() {
    this.init()
  }

  init() {
    const toast = document.createElement('div')
    toast.classList.add('toast')
    document.body.appendChild(toast)
    this.toast = toast
  }

  send(options) {
    const toastItem = new ToastItem(options)
    this.toast.appendChild(toastItem.dom)
    setTimeout(() => toastItem.show(), 50)
    toastItem._timer = setTimeout(() => {
      toastItem.destroy()
    }, options.duration || 3000)
  }

  destroy() {
    this.box.remove()
  }
}
