import MonthInput from './MonthInput'
import MonthMenu from './MonthMenu'
import supportDom from '../decorators/supportDom'
import { DEFAULT_TIMEZONE } from '../consts'

@supportDom
export default class Monthpicker {

  constructor(dom, date, options = {}) {
    this.dom = dom
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.date = date || new Date()
    this.menuDate = this.date

    this.options = options
    this.options.change = options.change || noop
    this.init()
  }

  init() {
    const { dom } = this
    this.monthInput = new MonthInput(
      dom.querySelector('[data-month]'),
      this.date,
      this.options
    )
    this.monthMenu = new MonthMenu({
      date: this.menuDate
    })
    this.addEvents()
  }

  addEvents() {
  }

  destroy() {
    this.monthInput.destroy()
    this.dateMenu.destroy()
  }
}
