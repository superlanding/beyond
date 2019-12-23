import { utcToZonedTime, format } from 'date-fns-tz'
import endOfDay from 'date-fns/endOfDay'

export default class Datepicker {

  constructor(dom, options = {}) {
    this.options = options
    this.init(dom)
  }

  init(dom) {
    this.dom = dom
    this.startDate = new Date()
    this.endDate = endOfDay(new Date())
    this.timezone = this.options.timezone || 'Asia/Taipei'

    this.inputDateStart = dom.querySelector('[data-date-start]')
    this.inputDateEnd = dom.querySelector('[data-date-end]')

    this.inputTimeStart = dom.querySelector('[data-time-start]')
    this.inputTimeEnd = dom.querySelector('[data-time-end]')

    this.inputDateStart.value = this.formatDate(this.startDate)
    this.inputDateEnd.value = this.formatDate(this.endDate)

    this.inputTimeStart.value = this.formatTime(this.startDate)
    this.inputTimeEnd.value = this.formatTime(this.endDate)

    this.appendMenu()
    this.addEvents()
  }

  formatDate(date) {
    const { timezone } = this
    const zonedDate = utcToZonedTime(date, timezone)
    const pattern = this.options.datePattern || 'yyyy/MM/dd'
    return format(zonedDate, pattern, { timezone })
  }

  formatTime(date) {
    const { timezone } = this
    const zonedDate = utcToZonedTime(date, timezone)
    const pattern = this.options.timePattern || 'HH:mm'
    return format(zonedDate, pattern, { timezone })
  }

  appendMenu() {
    const menu = document.createElement('div')
    menu.classList.add('datepicker-menu')
    const caption = document.createElement('div')
  }

  addEvents() {
    this.inputDateStart._handleStartInputFocus = () => {
    }
    this.inputDateStart.addEventListener('focus', this.inputDateStart._handleStartInputFocus, false)

    this.inputDateStart._handleStartInputBlur = () => {
    }
    this.inputDateStart.addEventListener('blur', this.inputDateStart._handleStartInputBlur, false)

    this.inputDateStart._handleStartInputChange = () => {
    }
    this.inputDateStart.addEventListener('change', this.inputDateStart._handleStartInputChange, false)


    this.inputDateStart._handleEndInputFocus = () => {
    }
    this.inputDateStart.addEventListener('focus', this.inputDateStart._handleEndInputFocus, false)

    this.inputDateStart._handleEndInputBlur = () => {
    }
    this.inputDateStart.addEventListener('blur', this.inputDateStart._handleEndInputBlur, false)

    this.inputDateEnd._handleEndInputChange = () => {
    }
    this.inputDateEnd.addEventListener('change', this.inputDateStart._handleEndInputChange, false)
  }

  destroy() {
    this.inputDateStart.removeEventListener('focus', this.inputDateStart._handleStartInputFocus, false)
    this.inputDateStart.removeEventListener('blur', this.inputDateStart._handleStartInputBlur, false)
    this.inputDateStart.removeEventListener('change', this.inputDateStart._handleStartInputChange, false)

    this.inputDateEnd.removeEventListener('focus', this.inputDateEnd._handleEndInputFocus, false)
    this.inputDateEnd.removeEventListener('blur', this.inputDateEnd._handleEndInputBlur, false)
    this.inputDateEnd.removeEventListener('change', this.inputDateEnd._handleEndInputChange, false)
  }
}
