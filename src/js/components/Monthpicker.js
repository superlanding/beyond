import MonthInput from './MonthInput'
import MonthMenu from './MonthMenu'
import supportDom from '../decorators/supportDom'
import { DEFAULT_TIMEZONE } from '../consts'
import { noop, parse } from '../utils'

@supportDom
export default class Monthpicker {

  constructor(dom, options = {}) {
    this.dom = dom
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.date = options.date
    this.menuDate = this.date

    this.options = options
    this.backdropMode = options.backdropMode || 'auto'
    this.change = options.change || noop
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
      date: this.menuDate,
      change: date => {
        this.monthInput.setDate(date)
        this.monthInput.clearStatus()
        this.monthMenu.hide()
      }
    })
    this.addEvents()
  }

  handleMonthInputFocus() {
    const { monthInput } = this
    monthInput.clearStatus()
    monthInput.setActive(true)
    this.monthMenu.show(this.dom)
  }

  handleMonthInputKeyUp(event) {
    const { monthInput } = this
    const { value } = event.target
    const res = parse(value, monthInput.datePattern, this.date)

    if (res.toString() === 'Invalid Date') {
      monthInput.setDanger(true)
      this.nextDate = null
    }
    else {
      monthInput.setDanger(false)
      this.nextDate = res
    }
  }

  handleMonthInputBlur() {
    if (this.nextDate) {
      this.date = this.nextDate
      this.menuDate = this.date
      this.monthMenu.setDate(this.menuDate)
      this.nextDate = null
    }
  }

  addEvents() {
    const { monthInput } = this
    monthInput.on('focus', () => this.handleMonthInputFocus())
    monthInput.on('click', event => event.stopPropagation())
    monthInput.on('keyup', event => this.handleMonthInputKeyUp(event))
    monthInput.on('blur', () => this.handleMonthInputBlur())

    if (this.backdropMode === 'auto') {
      this.addEvent(document, 'click', () => {
        this.monthMenu.hide()
        this.monthInput.clearStatus()
      })
    }
  }

  destroy() {
    this.monthInput.destroy()
    this.monthMenu.destroy()
  }
}
