class ToastItem {

  constructor(options) {
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
    const { btn, dom } = this
    const { btnCb } = this.options
    btn._handleClick = () => {
      const res = {
        clear: () => {
          this.destroy()
        }
      }
      btnCb(res)
    }
    btn.addEventListener('click', btn._handleClick, false)
  }

  destroy() {
    const { dom, btn } = this
    clearTimeout(dom._timer)
    btn.removeEventListener('click', btn._handleClick, false)
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
    document.body.append(toast)
    this.toast = toast
  }

  send(options) {
    const toastItem = new ToastItem(options)
    this.toast.appendChild(toastItem.dom)
    setTimeout(() => toastItem.show(), 50)
    toastItem._timer = setTimeout(() => {
      toastItem.destroy()
    }, options.timer || 3000)
  }

  destroy() {
    this.box.remove()
  }
}
