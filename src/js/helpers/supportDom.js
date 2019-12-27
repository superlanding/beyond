export default function supportDom(target) {

  return class extends target {

    init() {
      this._listeners = []
      this._externalListeners = []
      super.init()
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
      if (typeof super.destroy === 'function') {
        super.destroy()
      }
      this._externalListeners.length = 0
      this.removeEvents()
    }
  }
}
