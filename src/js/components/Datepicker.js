import parse from 'date-fns/parse'
import set from 'date-fns/set'
import noop from 'lodash.noop'
import toDate from 'date-fns/toDate'
import DateInput from './DateInput'
import TimeInput from './TimeInput'
import DateMenu from './DateMenu'
import TimeMenu from './TimeMenu'
import supportDom from '../helpers/supportDom'
import { DEFAULT_TIMEZONE } from '../consts'
import dateToTimestamp from '@superlanding/datetotimestamp'
import timestampToDate from '@superlanding/timestamptodate'

@supportDom
export default class Datepicker {

  constructor(dom, timestamp, options = {}) {
    this.dom = dom
    this.options = options
    this.options.change = options.change || noop
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.date = timestampToDate(timestamp)
    this.menuDate = toDate(this.date)
    this.focused = false
    this.nextDate = null
    this.init()
  }

  init() {
    const { dom } = this
    this.dateInput = new DateInput(
      dom.querySelector('[data-date]'),
      this.date,
      this.options
    )
    this.dateMenu = new DateMenu({
      date: this.menuDate,
      options: Object.assign({}, this.options, { useSingleMenu: true })
    })

    const timeInput = dom.querySelector('[data-time]')
    if (timeInput) {
      this.timeInput = new TimeInput(
        timeInput,
        this.date,
        this.options
      )
      this.timeMenu = new TimeMenu()
    }
    this.addEvents()
  }

  clearInputStatus() {
    this.dateInput.clearStatus()
    this.timeInput && this.timeInput.clearStatus()
  }

  handleDateInputFocus() {
    this.focused = true
    this.clearInputStatus()
    this.dateInput.setActive(true)
    this.dateMenu.setDate({ date: this.menuDate })
    this.dateMenu.show(this.dom)
    this.timeMenu && this.timeMenu.hide()
  }

  setTimestamp(timestamp) {
    return this.setDate(timestampToDate(timestamp))
  }

  setDate(date) {
    this.date = date
    this.dateInput.setDate(date)
    this.dateMenu.setDate({ startDate: date })
  }

  handleDateInputKeyUp(event) {
    const { date, dateInput } = this
    const res = parse(event.target.value, dateInput.datePattern, date)
    this.nextDate = null
    if (res.toString() === 'Invalid Date') {
      return dateInput.setDanger(true)
    }
    dateInput.setDanger(false)
    this.nextDate = res
  }

  handleDateInputBlur() {
    const { nextDate, date, dateInput } = this

    if (nextDate) {
      this.date = nextDate
      dateInput.setDate(nextDate)
      this.dateMenu.setDate({ startDate: nextDate })
      this.nextDate = null
    }
    else {
      dateInput.setDate(date)
    }
  }

  handleTimeInputFocus() {
    const { timeInput } = this
    this.focused = true
    this.clearInputStatus()
    timeInput.setActive(true)
    this.dateMenu.hide()
    this.timeMenu.show({ src: this.dom, date: timeInput.date })
  }

  handleTimeInputKeyUp(event) {
    const { date, timeInput } = this
    const res = parse(event.target.value, timeInput.timePattern, date)
    this.nextDate = null

    if (res.toString() === 'Invalid Date') {
      return timeInput.setDanger(true)
    }
    timeInput.setDanger(false)
    this.nextDate = res
  }

  handleTimeInputBlur() {
    const { nextDate, date, timeInput } = this

    if (nextDate) {
      this.date = nextDate
      timeInput.setDate(nextDate)
      this.nextDate = null
    }
    else {
      timeInput.setDate(date)
    }
  }

  addDateInputEvents() {
    this.dateInput.on('focus', () => this.handleDateInputFocus())
    this.dateInput.on('keyup', event => this.handleDateInputKeyUp(event))
    this.dateInput.on('blur', () => this.handleDateInputBlur())
  }

  addTimeInputEvents() {
    this.timeInput.on('focus', () => this.handleTimeInputFocus())
    this.timeInput.on('keyup', event => this.handleTimeInputKeyUp(event))
    this.timeInput.on('blur', () => this.handleTimeInputBlur())
  }

  emitChange() {
    const { date } = this
    this.options.change({
      date,
      timestamp: dateToTimestamp(date)
    })
  }

  addEvents() {

    this.addDateInputEvents()

    this.dateMenu.on('td-click', (event, res) => {
      event.stopPropagation()
      event.preventDefault()

      const { year, month, date } = res
      this.date = set(this.date, { year, month, date })
      this.dateInput.setDate(this.date)
      this.dateMenu.setDate({ startDate: this.date })
      this.dateInput.setActive(false)
      this.dateMenu.hide()
      this.emitChange()
    })

    if (this.timeInput) {
      this.addTimeInputEvents()

      this.timeMenu.on('click', (event, res) => {
        this.date = set(this.date, { hours: res.hour, minutes: res.minute })
        this.timeInput.setDate(this.date)
        this.timeMenu.hide()
        this.clearInputStatus()
        this.emitChange()
      })
    }

    this.addEvent(document, 'click', event => {
      const { dom, dateMenu, timeMenu } = this
      const { target } = event
      const dateMenuDom = dateMenu.dom
      const timeMenuDom = timeMenu ? timeMenu.dom : null

      if (this.focused) {
        this.focused = false
        return
      }
      if ((! dateMenu.isVisible) && (timeMenu && (! timeMenu.isVisible))) {
        return
      }
      if (dom.contains(target)) {
        return
      }
      if (dateMenuDom.contains(target)) {
        return
      }
      if (dateMenuDom === target) {
        return
      }
      if (timeMenuDom && timeMenuDom.contains(target)) {
        return
      }
      if (timeMenuDom && (timeMenuDom === target)) {
        return
      }
      this.clearInputStatus()
      dateMenu.hide()
      timeMenu && timeMenu.hide()
    })
  }

  destroy() {
    this.dateInput.destroy()
    this.dateMenu.destroy()
    this.timeInput && this.timeInput.destroy()
    this.timeMenu && this.timeMenu.destroy()
  }
}
