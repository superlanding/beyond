import { isFunction } from '../utils'
import createdComponents from '../consts/createdComponents'

const domMap = new Map()

export default function supportDom(target) {

  const targetName = target.name

  return class extends target {

    init() {
      if (this.classNameUsed) {
        console.warn(`This dom has already been initialized by ${targetName}`, this.dom)
        return
      }
      this.setClassNameByDom(target)

      this._listeners = []
      this._externalListeners = []
      if (isFunction(super.init)) {
        super.init()
      }
      createdComponents.push(this)
    }

    get classNameUsed() {
      if (this._skipDomChecking) {
        return false
      }
      const classnames = domMap.get(this.dom) || []
      return classnames.includes(targetName)
    }

    setClassNameByDom(target) {
      const { dom } = this
      if (dom) {
        const classes = domMap.get(dom) || []
        classes.push(targetName)
        domMap.set(dom, classes)
      }
    }

    deleteClassNameByDom(target) {
      const { dom } = this
      if (! dom) {
        return
      }
      const { name } = target
      const classnames = (domMap.get(dom) || [])
        .filter(classname => classname !== name)

      if (classnames.length === 0) {
        domMap.delete(dom)
      }
      else {
        domMap.set(dom, classnames)
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
      this.deleteClassNameByDom(target)
      this._externalListeners.length = 0
      this.removeEvents()
      if (isFunction(super.destroy)) {
        super.destroy()
      }
    }
  }
}
