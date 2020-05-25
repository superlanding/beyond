import parse from 'date-fns/parse'
import set from 'date-fns/set'
import noop from 'lodash.noop'
import TimeInput from './TimeInput'
import TimeMenu from './TimeMenu'
import supportDom from '../helpers/supportDom'
import { DEFAULT_TIMEZONE } from '../consts'
import dateToTimestamp from '@superlanding/datetotimestamp'
import timestampToDate from '@superlanding/timestamptodate'

@supportDom
export default class Timepicker {

  constructor(dom, timestamp, options = {}) {
    this.dom = dom
    this.options = options
    this.options.change = options.change || noop
    this.tz = options.tz || DEFAULT_TIMEZONE

    this.date = (timestamp === null) ? null : timestampToDate(timestamp)
    this.focused = false
    this.backdropMode = options.backdropMode || 'auto'
    this.init()
  }

  init() {
    this.timeInput = new TimeInput(
      this.dom,
      this.date,
      this.options
    )
    this.timeMenu = new TimeMenu()
    this.addEvents()
  }

  clearInputStatus() {
    this.timeInput.clearStatus()
  }

  handleTimeInputFocus() {
    const { timeInput } = this
    this.focused = true
    this.clearInputStatus()
    timeInput.setActive(true)
    this.timeMenu.show({ src: this.dom, date: timeInput.date })
  }

  handleTimeInputKeyUp(event) {
    const { date, timeInput } = this
    const { value } = event.target

    if ((! timeInput.required) && (value === '')) {
      this.nextDate = null
      return
    }
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
    else if (date) {
      timeInput.setDate(date)
    }
  }

  emitChange() {
    const { date } = this
    this.options.change({
      date,
      timestamp: dateToTimestamp(date)
    })
  }

  hide() {
    this.focused = false
    this.clearInputStatus()
    this.timeMenu.hide()
  }

  addEvents() {

    this.timeInput.on('focus', () => this.handleTimeInputFocus())
    this.timeInput.on('keyup', event => this.handleTimeInputKeyUp(event))
    this.timeInput.on('blur', () => this.handleTimeInputBlur())

    this.timeMenu.on('click', (event, res) => {
      if (this.date === null) {
        this.date = set(new Date(), { hours: res.hour, minutes: res.minute })
      }
      else {
        this.date = set(this.date, { hours: res.hour, minutes: res.minute })
      }
      this.timeInput.setDate(this.date)
      this.timeMenu.hide()
      this.clearInputStatus()
      this.emitChange()
    })

    this.addEvent(document, 'click', event => {
      if (this.focused) {
        this.focused = false
        return
      }
      if (this.backdropMode === 'manual') {
        return
      }
      if (event.target === this.dom) {
        return
      }
      this.hide()
    })
  }

  destroy() {
    this.timeInput.destroy()
    this.timeMenu.destroy()
  }
}
