import { isFunction } from '../utils'
import isUndef from '../utils/isUndef'
import createdComponents from '../consts/createdComponents'

const domMap = new Map()

export default function supportDom(target) {

  return class extends target {

    init() {
      if (domMap.has(this.dom) && isUndef(this._skipDomChecking)) {
        console.warn('This dom has already been initialized.', this.dom)
        return
      }
      this.setDomToMap()

      this._listeners = []
      this._externalListeners = []
      if (isFunction(super.init)) {
        super.init()
      }
      createdComponents.push(this)
    }

    setDomToMap() {
      const { dom } = this
      if (dom) {
        domMap.set(dom, true)
      }
    }

    deleteDomFromMap() {
      const { dom } = this
      if (dom) {
        domMap.delete(dom)
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
      this.deleteDomFromMap()
      this._externalListeners.length = 0
      this.removeEvents()
      if (isFunction(super.destroy)) {
        super.destroy()
      }
    }
  }
}
