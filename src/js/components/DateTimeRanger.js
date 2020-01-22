import { utcToZonedTime } from 'date-fns-tz'
import endOfDay from 'date-fns/endOfDay'
import parse from 'date-fns/parse'
import set from 'date-fns/set'
import noop from 'lodash.noop'
import startOfDay from 'date-fns/startOfDay'
import getHours from 'date-fns/getHours'
import getMinutes from 'date-fns/getMinutes'
import getSeconds from 'date-fns/getSeconds'
import DateInput from './DateInput'
import DatepickerTimeInput from './DatepickerTimeInput'
import DateMenu from './DateMenu'
import TimeMenu from './TimeMenu'
import DatepickerBtnArrow from './DatepickerBtnArrow'
import dateGt from '../helpers/dateGt'
import dateLt from '../helpers/dateLt'
import supportDom from '../helpers/supportDom'
import { DEFAULT_TIMEZONE } from '../consts'

@supportDom
export default class DateTimeRanger {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
    this.options.change = options.change || noop
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.lastTriggered = null
    this.nextDate = null
    this.focused = false
    this.inputDateStartSet = false
    this.inputDateEndSet = false
    this.init()
  }

  init() {
    const { dom } = this
    const startDate = this.options.startDate || new Date()
    const endDate = this.options.endDate || endOfDay(startDate)

    this.startDate = utcToZonedTime(startDate, this.tz)
    this.endDate = utcToZonedTime(endDate, this.tz)

    this.currentDate = this.startDate

    this.inputDateStart = new DateInput(
      dom.querySelector('[data-date-start]'),
      this.startDate,
      this.options
    )

    this.inputTimeStart = new DatepickerTimeInput(
      dom.querySelector('[data-time-start]'),
      this.startDate,
      this.options
    )

    this.btnArrow = new DatepickerBtnArrow(
      dom.querySelector('[data-btn-arrow]')
    )

    this.inputDateEnd = new DateInput(
      dom.querySelector('[data-date-end]'),
      this.endDate,
      this.options
    )

    this.inputTimeEnd = new DatepickerTimeInput(
      dom.querySelector('[data-time-end]'),
      this.endDate,
      this.options
    )

    this.dateMenu = new DateMenu({
      date: this.currentDate,
      startDate: this.startDate,
      endDate: this.endDate,
      options: this.options
    })
    this.timeMenu = new TimeMenu()

    this.addEvents()
  }

  setDates(startDate, endDate) {
    if (dateGt(startDate, endDate)) {
      throw new Error('Start date cannot be greater than end date.')
    }
    this.startDate = utcToZonedTime(startDate, this.tz)
    this.endDate = utcToZonedTime(endDate, this.tz)
    this.inputDateStart.setDate(this.startDate)
    this.inputTimeStart.setDate(this.startDate)
    this.inputDateEnd.setDate(this.endDate)
    this.inputTimeEnd.setDate(this.endDate)
  }

  clearInputStatus() {
    this.inputDateStart.clearStatus()
    this.inputTimeStart.clearStatus()
    this.inputDateEnd.clearStatus()
    this.inputTimeEnd.clearStatus()
  }

  clearTimeInputStatus() {
    this.inputTimeStart.clearStatus()
    this.inputTimeEnd.clearStatus()
  }

  handleDateInputFocus(input) {
    this.focused = true
    this.inputDateStartSet = false
    this.inputDateEndSet = false
    this.clearTimeInputStatus()
    this.inputDateStart.setActive(true)
    this.inputDateEnd.setActive(true)
    this.dateMenu.setDate({
      date: this.startDate,
      startDate: this.startDate,
      endDate: this.endDate
    })
    this.dateMenu.show(this.dom)
    this.timeMenu.hide()
  }

  handleTimeInputFocus(input) {
    this.focused = true
    this.clearInputStatus()
    input.setActive(true)
    this.lastTriggered = input
    this.dateMenu.hide()
    this.timeMenu.show({ src: this.dom, date: input.date })
  }

  handleDateInputKeyUp({ event, input, date, isStart }) {

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

  handleTimeInputKeyUp({ event, input, date, isStart }) {
    const res = parse(event.target.value, input.timePattern, date)
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

  handleDateInputBlur({ input, isStart }) {
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

  handleTimeInputBlur({ input, isStart }) {
    const dateProp = isStart ? 'startDate' : 'endDate'
    const oldDate = this[dateProp]
    const { nextDate } = this

    if (nextDate) {
      this[dateProp] = nextDate
      input.setDate(nextDate)
      this.nextDate = null
    }
    else {
      input.setDate(oldDate)
    }
  }

  addDateInputEvents() {
    this.inputDateStart.on('focus', event => {
      this.inputDateStart
      this.handleDateInputFocus(this.inputDateStart)
    })
    this.inputDateStart.on('keyup', event => {
      return this.handleDateInputKeyUp({
        event,
        input: this.inputDateStart,
        date: this.startDate,
        isStart: true
      })
    })
    this.inputDateStart.on('blur', () => {
      return this.handleDateInputBlur({
        input: this.inputDateStart,
        isStart: true
      })
    })

    this.inputDateEnd.on('focus', () => this.handleDateInputFocus(this.inputDateEnd))
    this.inputDateEnd.on('keyup', event => {
      return this.handleDateInputKeyUp({
        event,
        input: this.inputDateEnd,
        date: this.endDate,
        isStart: false
      })
    })
    this.inputDateEnd.on('blur', () => {
      return this.handleDateInputBlur({
        input: this.inputDateEnd,
        isStart: false
      })
    })
  }

  addTimeInputEvents() {
    this.inputTimeStart.on('focus', () => this.handleTimeInputFocus(this.inputTimeStart))
    this.inputTimeStart.on('keyup', event => {
      return this.handleTimeInputKeyUp({
        event,
        input: this.inputTimeStart,
        date: this.startDate,
        isStart: true
      })
    })
    this.inputTimeStart.on('blur', event => {
      return this.handleTimeInputBlur({
        input: this.inputTimeStart,
        isStart: true
      })
    })

    this.inputTimeEnd.on('focus', () => this.handleTimeInputFocus(this.inputTimeEnd))
    this.inputTimeEnd.on('keyup', event => {
      return this.handleTimeInputKeyUp({
        event,
        input: this.inputTimeEnd,
        date: this.startDate,
        isStart: false
      })
    })
    this.inputTimeEnd.on('blur', event => {
      return this.handleTimeInputBlur({
        input: this.inputTimeEnd,
        isStart: false
      })
    })
  }

  switchDates() {
    const oldStartDate = this.startDate
    const oldEndDate = this.endDate;
    [this.startDate, this.endDate] = [this.endDate, this.startDate]

    // keeps the time
    this.startDate = set(this.startDate, {
      hours: getHours(oldStartDate),
      minutes: getMinutes(oldStartDate),
      seconds: getSeconds(oldStartDate)
    })
    this.endDate = set(this.endDate, {
      hours: getHours(oldEndDate),
      minutes: getMinutes(oldEndDate),
      seconds: getSeconds(oldEndDate)
    })
    this.inputDateStart.setDate(this.startDate)
    this.inputDateEnd.setDate(this.endDate)
  }

  addMenuEvents() {
    this.dateMenu.on('td-mouseover', (event, res) => {
      if (this.dateMenu.startDate && (! this.dateMenu.endDate)) {
        this.dateMenu.setHoveredCell(res)
      }
    })
    this.dateMenu.on('td-click', (event, res) => {
      event.stopPropagation()
      event.preventDefault()

      if (this.inputDateStartSet && this.inputDateEndSet) {
        this.inputDateStartSet = false
        this.inputDateEndSet = false
      }

      const { year, month, date } = res

      if ((! this.inputDateStartSet) && (! this.inputDateEndSet)) {
        this.dateMenu.setDate({ startDate: null, endDate: null })
        const nextStartDate = set(this.startDate, { year, month, date })
        this.startDate = nextStartDate
        this.inputDateStart.setDate(nextStartDate)
        this.inputDateStartSet = true
        return this.dateMenu.setDate({
          startDate: this.startDate
        })
      }

      if (this.inputDateStartSet && (! this.inputDateEndSet)) {
        this.endDate = set(this.endDate, { year, month, date })

        // switch if next endDate is prior to startDate
        if (dateLt(startOfDay(this.endDate), startOfDay(this.startDate))) {
          this.switchDates()
        }
        this.inputDateStart.setDate(this.startDate)
        this.inputDateEnd.setDate(this.endDate)

        this.inputDateEndSet = true
        this.dateMenu.setDate({
          startDate: this.startDate,
          endDate: this.endDate
        })
        return this.options.change({
          startDate: this.startDate,
          endDate: this.endDate
        })
      }
    })

    this.timeMenu.on('click', (event, res) => {
      const nextDate = set(this.lastTriggered.date, { hours: res.hour, minutes: res.minute })
      if (this.lastTriggered === this.inputTimeStart) {
        this.startDate = nextDate
      }
      if (this.lastTriggered === this.inputTimeEnd) {
        this.endDate = nextDate
      }
      this.lastTriggered.setDate(nextDate)
      this.timeMenu.hide()
      this.clearInputStatus()
    })
  }

  addBtnArrowEvents() {
    this.btnArrow.on('click', () => {
      this.inputDateStart.focus()
      this.handleDateInputFocus(this.inputDateStart)
    })
  }

  addEvents() {

    this.addDateInputEvents()
    this.addTimeInputEvents()
    this.addMenuEvents()
    this.addBtnArrowEvents()

    this.addEvent(document, 'click', event => {
      const { dom, dateMenu, timeMenu } = this
      const { target } = event
      const dateMenuDom = dateMenu.dom
      const timeMenuDom = timeMenu.dom

      if (this.focused) {
        this.focused = false
        return
      }
      if ((! dateMenu.isVisible) && (! timeMenu.isVisible)) {
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

      if (timeMenuDom.contains(target)) {
        return
      }
      if (timeMenuDom === target) {
        return
      }

      this.clearInputStatus()

      if (dateLt(startOfDay(this.endDate), startOfDay(this.startDate))) {
        this.switchDates()
      }
      dateMenu.hide()
      timeMenu.hide()
    })
  }

  destroy() {
    this.inputDateStart.destroy()
    this.inputTimeStart.destroy()
    this.inputDateEnd.destroy()
    this.inputTimeEnd.destroy()
    this.dateMenu.destroy()
    this.timeMenu.destroy()
    this.btnArrow.destroy()
  }
}
