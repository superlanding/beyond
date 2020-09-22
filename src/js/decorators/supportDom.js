import { isFunction } from '../utils'
import createdComponents from '../consts/createdComponents'

export default function supportDom(target) {

  return class extends target {

    init() {
      if (this.beyondBound) {
        return
      }
      this.markBound()
      this._listeners = []
      this._externalListeners = []
      if (isFunction(super.init)) {
        super.init()
      }
      createdComponents.push(this)
    }

    get beyondBound() {
      const { dom } = this
      return dom && (dom.dataset.beyondBound === 'true')
    }

    markBound() {
      const { dom } = this
      if (dom) {
        dom.dataset.beyondBound = true
      }
    }

    markUnbind() {
      const { dom } = this
      if (dom) {
        delete dom.dataset.beyondBound
      }
    }

    on(name, func) {
      this._externalListeners.push({ name, func })
    }

    fire(name, ...args) {
      this._externalListeners.filter(row => row.name === name)
        .forEach(row => row.func.apply(this, args))
    }

    addEvent(dom, name, func) {
      dom.addEventListener(name, func)
      this._listeners.push({ dom, name, func })
    }

    removeEvents() {
      this._listeners.forEach(({ dom, name, func }) => {
        dom.removeEventListener(name, func)
      })
      this._listeners.length = 0
    }

    destroy() {
      this._externalListeners.length = 0
      this.removeEvents()
      this.markUnbind()
      if (isFunction(super.destroy)) {
        super.destroy()
      }
    }
  }
}
