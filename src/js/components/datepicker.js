import { utcToZonedTime } from 'date-fns-tz'
import endOfDay from 'date-fns/endOfDay'
import parse from 'date-fns/parse'
import set from 'date-fns/set'
import startOfDay from 'date-fns/startOfDay'
import DatepickerDateInput from './datepicker-date-input'
import DatepickerMenu from './datepicker-menu'
import dateGt from '../helpers/dateGt'
import dateLt from '../helpers/dateLt'

export default class Datepicker {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
    this.tz = options.tz || 'Asia/Taipei'
    this.lastTriggered = null
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

  change() {
    const { change } = this.options
    if (typeof change === 'function') {
      change({
        startDate: this.startDate,
        endDate: this.endDate
      })
    }
  }

  clearInputStatus() {
    this.inputDateStart.clearStatus()
    this.inputDateEnd.clearStatus()
  }

  handleInputFocus(input) {
    this.clearInputStatus()
    input.setActive(true)
    this.lastTriggered = input
    this.menu.setDate({ date: input.date })
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
    const { nextDate } = this

    if (nextDate) {
      this[dateProp] = nextDate
      input.setDate(nextDate)
      this.menu.setDate({ [dateProp]: nextDate })
      this.nextDate = null
    }
    else {
      input.setDate(oldDate)
    }
  }

  addEvents() {
    this.inputDateStart.on('focus', () => this.handleInputFocus(this.inputDateStart))
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

    this.inputDateEnd.on('focus', () => this.handleInputFocus(this.inputDateEnd))
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

    this.menu.on('td-click', (event, res) => {
      event.stopPropagation()
      event.preventDefault()

      const { lastTriggered } = this
      const { year, month, date } = res

      if (lastTriggered === this.inputDateStart) {
        const nextStartDate = set(this.startDate, { year, month, date })
        if (dateGt(startOfDay(nextStartDate), startOfDay(this.endDate))) {
          return
        }
        this.startDate = nextStartDate
        this.inputDateStart.setDate(nextStartDate)
        this.menu.setDate({
          date: this.startDate,
          startDate: this.startDate
        })
      }
      if (lastTriggered === this.inputDateEnd) {
        const nextEndDate = set(this.endDate, { year, month, date })
        if (dateLt(startOfDay(nextEndDate), startOfDay(this.startDate))) {
          return
        }
        this.endDate = nextEndDate
        this.inputDateEnd.setDate(nextEndDate)
        this.menu.setDate({
          date: this.endDate,
          endDate: this.endDate
        })
      }
      this.change()
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
      this.clearInputStatus()
      menu.hide()
    }
    document.addEventListener('click', this._handleDocClick, false)
  }

  destroy() {
    document.removeEventListener('click', this._handleDocClick, false)
    this.inputDateStart.destroy()
    this.inputDateEnd.destroy()
    this.menu.destroy()
  }
}
