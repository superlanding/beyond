import { isFunction } from '../utils'
import createdComponents from '../consts/createdComponents'

export default function supportDom(target) {

  return class extends target {

    init() {
      this._listeners = []
      this._externalListeners = []
      if (isFunction(super.init)) {
        super.init()
      }
      createdComponents.push(this)
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
      const listener = { dom, name, func }
      this._listeners.push(listener)

      return () => {
        this._listeners = this._listeners.filter(l => l !== listener)
      }
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
      if (isFunction(super.destroy)) {
        super.destroy()
      }
    }
  }
}
