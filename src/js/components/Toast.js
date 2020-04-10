import supportDom from '../helpers/supportDom'
import ToastItem from './ToastItem'

@supportDom
export default class Toast {

  constructor() {
    this.init()
  }

  init() {
    const toast = document.createElement('div')
    toast.classList.add('toast')
    document.body.appendChild(toast)
    this.toast = toast
    this.items = []
  }

  send(arg) {

    let options = arg

    if (typeof arg === 'string') {
      options = { message: arg }
    }

    const toastItem = new ToastItem(options)
    this.toast.appendChild(toastItem.dom)
    this.items.push(toastItem)

    toastItem._showTimer = setTimeout(() => toastItem.show(), 50)
    toastItem._timer = setTimeout(() => {
      this.items = this.items.filter(item => item !== toastItem)
      toastItem.destroy()
    }, options.duration || 3000)

    return () => {
      this.items = this.items.filter(item => item !== toastItem)
      toastItem.destroy()
    }
  }

  destroy() {
    this.items.forEach(item => item.destroy())
    this.toast.remove()
  }
}
