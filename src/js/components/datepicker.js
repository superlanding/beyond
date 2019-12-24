import { utcToZonedTime, format } from 'date-fns-tz'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import compareAsc from 'date-fns/compareAsc'
import endOfDay from 'date-fns/endOfDay'
import endOfMonth from 'date-fns/endOfMonth'
import getDay from 'date-fns/getDay'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import getMonth from 'date-fns/getMonth'
import getYear from 'date-fns/getYear'
import locale from 'date-fns/locale/zh-TW'
import parse from 'date-fns/parse'
import set from 'date-fns/set'
import startOfDay from 'date-fns/startOfDay'
import startOfMonth from 'date-fns/startOfMonth'
import subMonths from 'date-fns/subMonths'
import dateGt from '../helpers/dateGt'
import dateLt from '../helpers/dateLt'
import getFloatedTargetPos from '../helpers/getFloatedTargetPos'
import range from '../helpers/range'
import toPixel from '../helpers/toPixel'

const TYPE_EMPTY_CELL = Symbol('TYPE_EMPTY_CELL')
const TYPE_DAY_CELL = Symbol('TYPE_DAY_CELL')

const TRIGGERED_BY_INPUT_DATE_START = Symbol('TRIGGERED_BY_INPUT_DATE_START')
const TRIGGERED_BY_INPUT_DATE_END = Symbol('TRIGGERED_BY_INPUT_DATE_END')

const TYPE_START = Symbol('TYPE_START')
const TYPE_END = Symbol('TYPE_END')

const defaultWeekHeaderItems = [
  { id: 'monday', text: '一' },
  { id: 'tuesday', text: '二' },
  { id: 'wednesday', text: '三' },
  { id: 'thursday', text: '四' },
  { id: 'friday', text: '五' },
  { id: 'saturday', text: '六' },
  { id: 'sunday', text: '日' }
]

export default class Datepicker {

  constructor(dom, options = {}) {
    this.options = options
    this.init(dom)
  }

  init(dom) {
    this.isMenuVisible = false
    this.triggeredBy = null
    this.dom = dom
    this.tz = this.options.tz || 'Asia/Taipei'
    this.datePattern = this.options.datePattern || 'yyyy/MM/dd'
    this.timePattern = this.options.timePattern || 'HH:mm'
    this.startDate = utcToZonedTime(new Date(), this.tz)
    this.endDate = utcToZonedTime(endOfDay(new Date()))

    this.weekHeaderItems = this.options.weekHeaderItems || defaultWeekHeaderItems

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

  format(date, pattern) {
    return format(date, pattern, { timezone: this.tz })
  }

  formatDate(date) {
    return this.format(date, this.datePattern)
  }

  formatTime(date) {
    return this.format(date, this.timePattern)
  }

  getWeekHeaderItems() {
    return this.weekHeaderItems.map(item => {
      return `<li>${item.text}</li>`
    }).join('')
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

  appendMenu() {
    const menu = document.createElement('div')
    menu.className = 'datepicker-menu'
    menu.innerHTML = `
      <div class="datepicker-content">
        <div class="datepicker-caption" data-menu-caption></div>
        <ul class="datepicker-week-header">
          ${this.getWeekHeaderItems()}
        </ul>
        <table class="datepicker-date-table" data-date-table></table>
        <button class="datepicker-btn-prev" data-btn-prev>
          <i class="icon icon-chevron-left"></i>
        </button>
        <button class="datepicker-btn-next" data-btn-next>
          <i class="icon icon-chevron-right"></i>
        </button>
      </div>
    `
    this.menuCaption = menu.querySelector('[data-menu-caption]')
    this.menuTable = menu.querySelector('[data-date-table]')
    this.menuBtnPrev = menu.querySelector('[data-btn-prev]')
    this.menuBtnNext = menu.querySelector('[data-btn-next]')

    this._handleMenuBtnPrevClick = () => this.toPrevMonth()
    this._handleMenuBtnNextClick = () => this.toNextMonth()

    this.menuBtnPrev.addEventListener('click', this._handleMenuBtnPrevClick, false)
    this.menuBtnNext.addEventListener('click', this._handleMenuBtnNextClick, false)

    this._handleMenuTableClick = event => {
      if ('dateTableCell' in event.target.dataset) {
        const year = getYear(this.currentDate)
        const month = getMonth(this.currentDate)
        const date = parseInt(event.target.textContent.trim(), 10)
        if (this.triggeredByInputDateStart()) {
          const nextStartDate = set(this.startDate, { year, month, date })
          if (dateGt(startOfDay(nextStartDate), startOfDay(this.endDate))) {
            return
          }
          this.startDate = nextStartDate
          this.setMenuDate(this.startDate)
          this.setInput(this.inputDateStart, this.startDate)
          this.setInput(this.inputDateEnd, this.endDate)
        }
        if (this.triggeredByInputDateEnd()) {
          const nextEndDate = set(this.endDate, { year, month, date })
          if (dateLt(startOfDay(nextEndDate), startOfDay(this.startDate))) {
            return
          }
          this.endDate = nextEndDate
          this.setMenuDate(this.endDate)
          this.setInput(this.inputDateStart, this.startDate)
          this.setInput(this.inputDateEnd, this.endDate)
        }
        this.change()
        event.stopPropagation()
        event.preventDefault()
      }
    }
    this.menuTable.addEventListener('click', this._handleMenuTableClick, false)

    document.body.appendChild(menu)
    this.menu = menu
  }

  setInput(input, date) {
    input.value = this.formatDate(date)
  }

  getTableRows({ menuDate, startDate, endDate }) {

    const daysInMonth = getDaysInMonth(menuDate)
    const firstDateOfMonth = startOfMonth(menuDate)
    const toEmptyCell = () => ({ type: TYPE_EMPTY_CELL })

    const firstWeekday = getDay(startOfMonth(menuDate))
    const beforeWeekday = ((firstWeekday - 1) === -1) ? 6 : (firstWeekday - 1)
    const emptyHeadRows = range(1, beforeWeekday).map(toEmptyCell)

    // 00:00:00
    const startOfStartDate = startOfDay(startDate)
    const endOfEndDate = startOfDay(endDate)

    const rows = range(1, daysInMonth).map(day => {

      const date = addDays(firstDateOfMonth, day - 1)
      const resCompareStart = compareAsc(startOfStartDate, date)
      const resCompareEnd = compareAsc(endOfEndDate, date)

      return {
        type: TYPE_DAY_CELL,
        isStartDate: (resCompareStart === 0),
        isEndDate: (resCompareEnd === 0),
        isSelected: (resCompareStart === -1) && (resCompareEnd === 1),
        day
      }
    })

    const lastWeekday = getDay(endOfMonth(menuDate))
    const afterLastWeekday = (lastWeekday + 1 % 7)
    const emptyTailRows = range(afterLastWeekday, 6).map(toEmptyCell)

    return emptyHeadRows.concat(rows).concat(emptyTailRows)
  }

  getTableRowHtml(row) {
    if (row.type === TYPE_EMPTY_CELL) {
      return '<td></td>'
    }
    if (row.isStartDate || row.isEndDate) {
      return `<td class="cell selected-ex" data-date-table-cell>${row.day}</td>`
    }
    if (row.isSelected) {
      return `<td class="cell selected" data-date-table-cell>${row.day}</td>`
    }
    return `<td class="cell" data-date-table-cell>${row.day}</td>`
  }

  setTableHtml(rows) {
    this.menuTable.innerHTML = rows.map((row, i) => {
      const rowHtml = this.getTableRowHtml(row)
      const r = i % 7
      if (r === 0) {
        return `<tr>${rowHtml}`
      }
      if (r === 6) {
        return `${rowHtml}</tr>`
      }
      return rowHtml
    }).join('')
  }

  setMenuDate(date) {
    this.currentDate = date
    const options = { timezone: this.tz, locale }
    this.menuCaption.textContent = format(date, 'yyyy MMMM', options)
    const rows = this.getTableRows({
      menuDate: date,
      startDate: this.startDate,
      endDate: this.endDate
    })
    this.setTableHtml(rows)
  }

  placeMenu() {
    const { menu } = this
    const pos = getFloatedTargetPos({
      src: this.dom,
      target: menu,
      place: 'bottom',
      align: 'right',
      offset: 20
    })
    menu.style.left = toPixel(pos.left)
    menu.style.top = toPixel(pos.top)
  }

  showMenu() {
    const { menu } = this
    menu.style.opacity = 0
    menu.style.display = 'block'
    this.placeMenu()
    menu.style.opacity = 1
    this.isMenuVisible = true
  }

  clearActiveClass() {
    this.inputDateStart.classList.remove('active')
    this.inputDateEnd.classList.remove('active')
  }

  hideMenu() {
    this.clearActiveClass()
    this.menu.style.display = 'none'
    this.isMenuVisible = false
  }

  toPrevMonth() {
    this.setMenuDate(subMonths(this.currentDate, 1))
  }

  toNextMonth() {
    this.setMenuDate(addMonths(this.currentDate, 1))
  }

  isStart(type) {
    return TYPE_START === type
  }

  isEnd(type) {
    return TYPE_END === type
  }

  handleInputKeyUp({ event, type }) {
    const isStartType = this.isStart(type)
    const isEndType = this.isEnd(type)
    const date = isStartType ? this.startDate : this.endDate
    const input = isStartType ? this.inputDateStart: this.inputDateEnd
    const res = parse(event.target.value, this.datePattern, date)

    input._nextDate = null

    if (res.toString() === 'Invalid Date') {
      input.classList.add('danger')
    }
    else if (isStartType && dateGt(startOfDay(res), startOfDay(this.endDate))) {
      input.classList.add('danger')
    }
    else if (isEndType && dateLt(startOfDay(res), startOfDay(this.startDate))) {
      input.classList.add('danger')
    }
    else {
      input.classList.remove('danger')
      input._nextDate = res
    }
  }

  handleInputBlur(type) {
    const isStartType = this.isStart(type)
    const input = isStartType ? this.inputDateStart : this.inputDateEnd
    const dateProp = isStartType ? 'startDate' : 'endDate'
    const date = isStartType ? this.startDate : this.endDate
    const nextDate = input._nextDate ? input._nextDate : this[dateProp]
    input.value = this.formatDate(nextDate)
    if (input._nextDate) {
      this[dateProp] = input._nextDate
      input._nextDate = null
    }
    input.classList.remove('danger')
  }

  addEvents() {
    this.inputDateStart._handleStartInputFocus = () => {
      this.clearActiveClass()
      this.inputDateStart.classList.add('active')
      this.triggeredBy = TRIGGERED_BY_INPUT_DATE_START
      this.setMenuDate(this.startDate)
      this.showMenu()
    }
    this.inputDateStart.addEventListener('focus', this.inputDateStart._handleStartInputFocus, false)

    this.inputDateStart._handleStartInputKeyUp = event => {
      return this.handleInputKeyUp({ event, type: TYPE_START })
    }
    this.inputDateStart.addEventListener('keyup', this.inputDateStart._handleStartInputKeyUp, false)

    this.inputDateStart._handleStartInputBlur = () => this.handleInputBlur(TYPE_START)
    this.inputDateStart.addEventListener('blur', this.inputDateStart._handleStartInputBlur, false)

    this.inputDateEnd._handleEndInputFocus = () => {
      this.clearActiveClass()
      this.inputDateEnd.classList.add('active')
      this.triggeredBy = TRIGGERED_BY_INPUT_DATE_END
      this.setMenuDate(this.endDate)
      this.showMenu()
    }
    this.inputDateEnd.addEventListener('focus', this.inputDateEnd._handleEndInputFocus, false)

    this.inputDateEnd._handleEndInputKeyUp = event => {
      return this.handleInputKeyUp({ event, type: TYPE_END })
    }
    this.inputDateEnd.addEventListener('keyup', this.inputDateEnd._handleEndInputKeyUp, false)

    this.inputDateEnd._handleEndInputBlur = () => this.handleInputBlur(TYPE_END)
    this.inputDateEnd.addEventListener('blur', this.inputDateEnd._handleEndInputBlur, false)

    this._handleDocClick = event => {
      const { dom, menu } = this
      const { target } = event
      if (! this.isMenuVisible) {
        return
      }
      if (dom.contains(target)) {
        return
      }
      if (menu.contains(target)) {
        return
      }
      if (menu === event.target) {
        return
      }
      this.hideMenu()
    }
    document.addEventListener('click', this._handleDocClick, false)
  }

  destroy() {
    this.inputDateStart.removeEventListener('focus', this.inputDateStart._handleStartInputFocus, false)
    this.inputDateStart.removeEventListener('keyup', this.inputDateStart._handleStartInputKeyUp, false)

    this.inputDateEnd.removeEventListener('focus', this.inputDateEnd._handleEndInputFocus, false)
    this.inputDateEnd.removeEventListener('keyup', this.inputDateEnd._handleEndInputKeyUp, false)
    document.removeEventListener('click', this._handleDocClick, false)

    this.menuBtnPrev.removeEventListener('click', this._handleMenuBtnPrevClick, false)
    this.menuBtnNext.removeEventListener('click', this._handleMenuBtnNextClick, false)
    this.menuTable.removeEventListener('click', this._handleMenuTableClick, false)

    this.menuCaption = null
    this.menuTable = null
    this.menuBtnPrev = null
    this.menuBtnNext = null
    this.menu.remove()
    this.menu = null
  }
}
