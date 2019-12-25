import { format } from 'date-fns-tz'
import { DEFAULT_TIMEZONE } from '../consts'
import supportDom from '../helpers/supportDom'

@supportDom
export default class DatepickerDateInput {

  constructor(dom, date, options = {}) {
    this.active = false
    this.danger = false
    this.dom = dom
    this.date = date
    this.options = options
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.datePattern = options.datePattern || 'yyyy/MM/dd'
    this.init()
  }

  init() {
    const { dom } = this
    dom.value = this.format(this.date)
    if (! dom.hasAttribute('placeholder')) {
      dom.setAttribute('placeholder', this.datePattern.toUpperCase())
    }
    this.addEvents()
  }

  format(date) {
    return format(date, this.datePattern, { timezone: this.tz })
  }

  setDate(date) {
    this.date = date
    this.dom.value = this.format(date)
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

    this._handleFocus = event => this.fire('focus', event)
    dom.addEventListener('focus', this._handleFocus, false)

    this._handleKeyUp = event => this.fire('keyup', event)
    dom.addEventListener('keyup', this._handleKeyUp, false)

    this._handleBlur = event => this.fire('blur', event)
    dom.addEventListener('blur', this._handleBlur, false)
  }

  destroy() {
    const { dom } = this
    dom.removeEventListener('focus', this._handleFocus, false)
    dom.removeEventListener('keyup', this._handleKeyUp, false)
    dom.removeEventListener('blur', this._handleBlur, false)
  }
}
