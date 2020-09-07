import supportDom from '../decorators/supportDom'

@supportDom
export default class Checkbox {

  constructor(dom) {
    this.dom = dom
    this.init()
  }

  init() {
    const { dom } = this
    this.addEvent(dom, 'focus', this.handleFocus)
    this.addEvent(dom, 'blur', this.handleBlur)
  }

  handleFocus() {
    this.parentNode.classList.add('focus')
  }

  handleBlur() {
    this.parentNode.classList.remove('focus')
  }
}
