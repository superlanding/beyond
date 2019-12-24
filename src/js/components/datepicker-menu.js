import { format } from 'date-fns-tz'
import addDays from 'date-fns/addDays'
import compareAsc from 'date-fns/compareAsc'
import endOfMonth from 'date-fns/endOfMonth'
import getDay from 'date-fns/getDay'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import getMonth from 'date-fns/getMonth'
import getYear from 'date-fns/getYear'
import set from 'date-fns/set'
import startOfDay from 'date-fns/startOfDay'
import startOfMonth from 'date-fns/startOfMonth'
import getFloatedTargetPos from '../helpers/getFloatedTargetPos'
import range from '../helpers/range'
import toPixel from '../helpers/toPixel'
import { DEFAULT_TIMEZONE, DEFAULT_LOCALE } from '../consts'

const DEFAULT_WEEK_HEADER_ITEMS = [
  { id: 'monday', text: '一' },
  { id: 'tuesday', text: '二' },
  { id: 'wednesday', text: '三' },
  { id: 'thursday', text: '四' },
  { id: 'friday', text: '五' },
  { id: 'saturday', text: '六' },
  { id: 'sunday', text: '日' }
]

const CELL_TYPE_EMPTY = Symbol('CELL_TYPE_EMPTY')
const CELL_TYPE_DAY = Symbol('CELL_TYPE_DAY')

export default class DatepickerMenu {

  constructor({ date, startDate, endDate, options = {} }) {
    this.date = date
    this.options = options
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.captionPattern = options.captionPattern || 'yyyy MMMM'
    this.weekHeaderItems = options.weekHeaderItems || DEFAULT_WEEK_HEADER_ITEMS
    this.listeners = []
    this.isVisible = false
    this.init()
  }

  init() {
    this.addMenu()
    this.addEvents()
  }

  getTableRows() {

    const { date, startDate, endDate } = this

    const daysInMonth = getDaysInMonth(date)
    const firstDateOfMonth = startOfMonth(date)
    const toEmptyCell = () => ({ type: CELL_TYPE_EMPTY })

    const firstWeekday = getDay(startOfMonth(date))
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
        type: CELL_TYPE_DAY,
        isStartDate: (resCompareStart === 0),
        isEndDate: (resCompareEnd === 0),
        isSelected: (resCompareStart === -1) && (resCompareEnd === 1),
        day
      }
    })

    const lastWeekday = getDay(endOfMonth(date))
    const afterLastWeekday = (lastWeekday + 1 % 7)
    const emptyTailRows = range(afterLastWeekday, 6).map(toEmptyCell)

    return emptyHeadRows.concat(rows).concat(emptyTailRows)
  }

  setDate(date) {
    this.date = date
    const options = { timezone: this.tz, locale: DEFAULT_LOCALE }
    this.menuCaption.textContent = format(date, this.captionPattern, options)
    const rows = this.getTableRows()
    this.setTableHtml(rows)
  }

  getWeekHeaderItems() {
    return this.weekHeaderItems.map(item => `<li>${item.text}</li>`)
      .join('')
  }

  setTableHtml(rows) {
    this.menuTable.innerHTML = rows.map((row, i) => {
      const rowHtml = this.getTdHtml(row)
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

  getTdHtml(row) {
    if (row.type === CELL_TYPE_EMPTY) {
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

  addMenu() {
    const dom = document.createElement('div')
    dom.className = 'datepicker-menu'
    dom.innerHTML = `
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
    this.menuCaption = dom.querySelector('[data-menu-caption]')
    this.menuTable = dom.querySelector('[data-date-table]')
    this.menuBtnPrev = dom.querySelector('[data-btn-prev]')
    this.menuBtnNext = dom.querySelector('[data-btn-next]')

    document.body.appendChild(dom)
    this.dom = dom
  }

  on(name, func) {
    this.listeners.push({ name, func })
  }

  addEvents() {
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
          this.inputDateStart.setDate(nextStartDate)
          this.setMenuDate(this.inputDateStart.date)
        }
        if (this.triggeredByInputDateEnd()) {
          const nextEndDate = set(this.endDate, { year, month, date })
          if (dateLt(startOfDay(nextEndDate), startOfDay(this.startDate))) {
            return
          }
          this.endDate = nextEndDate
          this.setMenuDate(this.inputDateEnd.date)
          this.setInput(this.inputDateStart, this.startDate)
          this.setInput(this.inputDateEnd, this.endDate)
        }
        this.change()
        event.stopPropagation()
        event.preventDefault()
      }
    }
    this.menuTable.addEventListener('click', this._handleMenuTableClick, false)
  }

  pos(src) {
    const { dom } = this
    const pos = getFloatedTargetPos({
      src,
      target: dom,
      place: 'bottom',
      align: 'right',
      offset: 20
    })
    dom.style.left = toPixel(pos.left)
    dom.style.top = toPixel(pos.top)
  }

  show(src) {
    const { dom } = this
    dom.style.opacity = 0
    dom.style.display = 'block'
    this.pos(src)
    dom.style.opacity = 1
    this.isVisible = true
  }

  hide() {
    this.dom.style.display = 'none'
    this.isVisible = false
  }

  destroy() {
    document.removeEventListener('click', this._handleDocClick, false)

    this.menuBtnPrev.removeEventListener('click', this._handleMenuBtnPrevClick, false)
    this.menuBtnNext.removeEventListener('click', this._handleMenuBtnNextClick, false)
    this.menuTable.removeEventListener('click', this._handleMenuTableClick, false)

    this.menuCaption = null
    this.menuTable = null
    this.menuBtnPrev = null
    this.menuBtnNext = null
    this.dom.remove()
    this.menu = null

    this.listeners.length = 0
  }
}
