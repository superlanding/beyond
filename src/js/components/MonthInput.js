import { DEFAULT_TIMEZONE } from '../consts'
import supportDom from '../decorators/supportDom'
import isTouchDevice from '../utils/isTouchDevice'
import { format } from '../utils'

@supportDom
export default class MonthInput {

  constructor(dom, date, options = {}) {
    this.active = false
    this.danger = false
    this.dom = dom
    this.date = date
    this.options = options
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.datePattern = options.datePattern || 'yyyy/MM'
    this.init()
  }

  focus() {
    this.dom.focus()
  }

  init() {
    this.initInput()
    this.addEvents()
  }

  initInput() {
    const { dom } = this
    if (this.date) {
      dom.value = this.format(this.date)
    }
    if (! dom.hasAttribute('placeholder')) {
      dom.setAttribute('placeholder', this.datePattern.toUpperCase())
    }
    if (isTouchDevice()) {
      dom.setAttribute('readonly', 'readonly')
    }
  }

  format(date) {
    return format(date, this.datePattern, { timezone: this.tz })
  }

  setDate(date) {
    this.date = date
    this.dom.value = date ? this.format(date) : ''
  }

  setActive(active) {
    this.active = active
    const func = active ? 'add' : 'remove'
    this.dom.classList[func]('active')
  }

  setDanger(danger) {
    this.danger = danger
    const func = danger ? 'add' : 'remove'
    this.dom.classList[func]('danger')
  }

  clearStatus() {
    this.setActive(false)
    this.setDanger(false)
  }

  addEvents() {
    const { dom } = this
    this.addEvent(dom, 'click', event => this.fire('click', event))
    this.addEvent(dom, 'focus', event => this.fire('focus', event))
    this.addEvent(dom, 'keyup', event => this.fire('keyup', event))
    this.addEvent(dom, 'blur', event => this.fire('blur', event))
  }
}
