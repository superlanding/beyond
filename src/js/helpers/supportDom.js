export default function supportDom(target) {
  return class extends target {

    constructor(...args) {
      super(...args)
      this._externalListeners = []
    }

    on(name, func) {
      this._externalListeners.push({ name, func })
    }

    fire(name, ...args) {
      this._externalListeners.filter(row => row.name === name)
        .forEach(row => row.func.apply(this, args))
    }

    destroy() {
      if (typeof super.destroy === 'function') {
        super.destroy()
      }
      this._externalListeners.length = 0
    }
  }
}
