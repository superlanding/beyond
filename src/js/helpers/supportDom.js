export default function supportDom(target) {
  return class extends target {

    constructor(...args) {
      super(...args)
      this._listeners = []
    }

    on(name, func) {
      this._listeners.push({ name, func })
    }

    fire(name, ...args) {
      this._listeners.filter(row => row.name === name)
        .forEach(row => row.func.apply(this, args))
    }

    destroy() {
      if (typeof super.destroy === 'function') {
        super.destroy()
      }
      this._listeners.length = 0
    }
  }
}
