import supportDom from '../helpers/supportDom'

@supportDom
export default class ToastItem {

  constructor(options = {}) {
    this.options = options
    this.init()
  }

  init() {

    const { message, btnText, btnCb } = this.options

    const dom = document.createElement('div')
    dom.innerHTML = `
      <div class="toast-item">
        <div class="toast-message">${message}</div>
      </div>
    `
    dom.className = 'toast-item-box'

    this.dom = dom

    if (btnText) {
      this.dom.classList.add('has-btn')
      this.createBtn(btnText)
    }
    if (btnText && btnCb) {
      this.createBtnCb()
    }
  }

  show() {
    this.dom.classList.add('visible')
  }

  createBtn() {
    const btn = document.createElement('button')
    btn.className = 'toast-btn'
    btn.innerText = this.options.btnText
    this.dom.querySelector('.toast-item').appendChild(btn)
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
    clearTimeout(dom._showTimer)
    clearTimeout(dom._timer)
    dom.remove()
  }
}
