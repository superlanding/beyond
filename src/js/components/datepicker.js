import { utcToZonedTime, format } from 'date-fns-tz'
import locale from 'date-fns/locale/zh-TW'
import parse from 'date-fns/parse'
import endOfDay from 'date-fns/endOfDay'
import subMonths from 'date-fns/subMonths'
import startOfDay from 'date-fns/startOfDay'
import dateGt from '../helpers/dateGt'
import dateLt from '../helpers/dateLt'
import DatepickerDateInput from './datepicker-date-input'
import DatepickerMenu from './datepicker-menu'

export default class Datepicker {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
    this.tz = options.tz || 'Asia/Taipei'
    this.triggeredBy = null
    this.nextDate = null
    this.init()
  }

  init() {
    const { dom } = this
    this.startDate = utcToZonedTime(new Date(), this.tz)
    this.endDate = utcToZonedTime(endOfDay(new Date()), this.tz)

    this.currentDate = this.startDate

    this.inputDateStart = new DatepickerDateInput({
      dom: dom.querySelector('[data-date-start]'),
      date: this.startDate,
      options: this.options
    })

    this.inputDateEnd = new DatepickerDateInput({
      dom: dom.querySelector('[data-date-end]'),
      date: this.endDate,
      options: this.options
    })

    this.menu = new DatepickerMenu({
      date: this.currentDate,
      startDate: this.startDate,
      endDate: this.endDate,
      options: this.options
    })

    this.addEvents()
  }

  format(date, pattern) {
    return format(date, pattern, { timezone: this.tz })
  }

  formatDate(date) {
    return this.format(date, this.datePattern)
  }

  change() {
    if (typeof this.options.change === 'function') {
      this.options.change({
        startDate: this.startDate,
        endDate: this.endDate
      })
    }
  }

  triggeredByInputDateStart() {
    return this.triggeredBy === TRIGGERED_BY_INPUT_DATE_START
  }

  triggeredByInputDateEnd() {
    return this.triggeredBy === TRIGGERED_BY_INPUT_DATE_END
  }

  setMenuDate(date) {
    this.currentDate = date
    const options = { timezone: this.tz, locale }
    this.menuCaption.textContent = format(date, 'yyyy MMMM', options)
    const rows = this.getTableRows({
      menuDate: date,
      startDate: this.inputDateStart.date,
      endDate: this.inputDateEnd.date
    })
    this.setTableHtml(rows)
  }

  clearInputStatus() {
    this.inputDateStart.clearStatus()
    this.inputDateEnd.clearStatus()
  }

  toPrevMonth() {
    this.setMenuDate(subMonths(this.currentDate, 1))
  }

  toNextMonth() {
    this.setMenuDate(addMonths(this.currentDate, 1))
  }

  handleInputFocus(input) {
    this.clearInputStatus()
    input.setActive(true)
    this.lastTriggered = input
    this.menu.setDate(input.date)
    this.menu.show(this.dom)
  }

  handleInputKeyUp({ event, input, date, isStart }) {

    const res = parse(event.target.value, input.datePattern, date)
    this.nextDate = null

    if (res.toString() === 'Invalid Date') {
      return input.setDanger(true)
    }
    if (isStart && dateGt(startOfDay(res), startOfDay(this.endDate))) {
      return input.setDanger(true)
    }
    if ((! isStart) && dateLt(startOfDay(res), startOfDay(this.startDate))) {
      return input.setDanger(true)
    }
    input.setDanger(false)
    this.nextDate = res
  }

  handleInputBlur({ input, isStart }) {
    const dateProp = isStart ? 'startDate' : 'endDate'
    const oldDate = this[dateProp]

    if (this.nextDate) {
      this[dateProp] = this.nextDate
      input.setDate(this.nextDate)
      this.nextDate = null
    }
    else {
      input.setDate(oldDate)
    }
    input.clearStatus()
  }

  addEvents() {
    this.inputDateStart.on('click', event => event.stopPropagation())
    this.inputDateStart.on('focus', event => this.handleInputFocus(this.inputDateStart))
    this.inputDateStart.on('keyup', event => {
      return this.handleInputKeyUp({
        event,
        input: this.inputDateStart,
        date: this.startDate,
        isStart: true
      })
    })
    this.inputDateStart.on('blur', () => {
      return this.handleInputBlur({
        input: this.inputDateStart,
        isStart: true
      })
    })

    this.inputDateEnd.on('click', event => event.stopPropagation())
    this.inputDateEnd.on('focus', event => this.handleInputFocus(this.inputDateEnd))
    this.inputDateEnd.on('keyup', event => {
      return this.handleInputKeyUp({
        event,
        input: this.inputDateEnd,
        date: this.endDate,
        isStart: false
      })
    })
    this.inputDateEnd.on('blur', () => {
      return this.handleInputBlur({
        input: this.inputDateEnd,
        isStart: false
      })
    })

    this._handleDocClick = event => {
      const { dom, menu } = this
      const { target } = event
      const menuDom = menu.dom

      if (! menu.isVisible) {
        return
      }
      if (dom.contains(target)) {
        return
      }
      if (menuDom.contains(target)) {
        return
      }
      if (menuDom === event.target) {
        return
      }
      console.log('hide', target)
      menu.hide()
    }
    document.addEventListener('click', this._handleDocClick, false)
  }

  destroy() {
    this.inputDateStart.destroy()
    this.inputDateEnd.destroy()
    this.menu.destroy()
  }
}
