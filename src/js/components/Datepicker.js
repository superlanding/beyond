import { utcToZonedTime } from 'date-fns-tz'
import endOfDay from 'date-fns/endOfDay'
import parse from 'date-fns/parse'
import set from 'date-fns/set'
import startOfDay from 'date-fns/startOfDay'
import DatepickerDateInput from './DatepickerDateInput'
import DatepickerTimeInput from './DatepickerTimeInput'
import DatepickerDateMenu from './DatepickerDateMenu'
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

    this.inputDateStart = new DatepickerDateInput(
      dom.querySelector('[data-date-start]'),
      this.startDate,
      this.options
    )

    this.inputTimeStart = new DatepickerTimeInput(
      dom.querySelector('[data-time-start]'),
      this.startDate,
      this.options
    )

    this.inputDateEnd = new DatepickerDateInput(
      dom.querySelector('[data-date-end]'),
      this.endDate,
      this.options
    )

    this.inputTimeEnd = new DatepickerTimeInput(
      dom.querySelector('[data-time-end]'),
      this.endDate,
      this.options
    )

    this.dateMenu = new DatepickerDateMenu({
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
    this.inputTimeStart.clearStatus()
    this.inputDateEnd.clearStatus()
    this.inputTimeEnd.clearStatus()
  }

  handleInputFocus(input) {
    this.clearInputStatus()
    input.setActive(true)
    this.lastTriggered = input

    if (input instanceof DatepickerDateInput) {
      this.dateMenu.setDate({ date: input.date })
      this.dateMenu.show(this.dom)
    }
    if (input instanceof DatepickerTimeInput) {
      this.dateMenu.hide()
    }
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
      this.dateMenu.setDate({ [dateProp]: nextDate })
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

    this.inputTimeStart.on('focus', () => this.handleInputFocus(this.inputTimeStart))

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

    this.dateMenu.on('td-click', (event, res) => {
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
        this.dateMenu.setDate({
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
        this.dateMenu.setDate({
          date: this.endDate,
          endDate: this.endDate
        })
      }
      this.change()
    })

    this._handleDocClick = event => {
      const { dom, dateMenu } = this
      const { target } = event
      const menuDom = dateMenu.dom

      if (! dateMenu.isVisible) {
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
      dateMenu.hide()
    }
    document.addEventListener('click', this._handleDocClick, false)
  }

  destroy() {
    document.removeEventListener('click', this._handleDocClick, false)
    this.inputDateStart.destroy()
    this.inputDateEnd.destroy()
    this.dateMenu.destroy()
  }
}
