import isFunction from 'lodash.isfunction'

export default function supportDom(target) {

  return class extends target {

    init() {
      const { dom } = this
      if (dom && dom.dataset.beyondBound) {
        return
      }
      this._listeners = []
      this._externalListeners = []
      if (this.dom) {
        this.dom.dataset.beyondBound = 1
      }
      if (isFunction(super.init)) {
        super.init()
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
      if (this.dom) {
        delete this.dom.dataset.beyondBound
      }
      if (isFunction(super.destroy)) {
        super.destroy()
      }
    }
  }
}
