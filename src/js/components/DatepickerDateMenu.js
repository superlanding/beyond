import { format } from 'date-fns-tz'
import addDays from 'date-fns/addDays'
import set from 'date-fns/set'
import addMonths from 'date-fns/addMonths'
import compareAsc from 'date-fns/compareAsc'
import endOfMonth from 'date-fns/endOfMonth'
import getDay from 'date-fns/getDay'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import getMonth from 'date-fns/getMonth'
import getYear from 'date-fns/getYear'
import startOfDay from 'date-fns/startOfDay'
import startOfMonth from 'date-fns/startOfMonth'
import subMonths from 'date-fns/subMonths'
import getFloatedTargetPos from '../helpers/getFloatedTargetPos'
import range from '../helpers/range'
import toPixel from '../helpers/toPixel'
import isTouchDevice from '../helpers/isTouchDevice'
import dateLt from '../helpers/dateLt'
import dateEq from '../helpers/dateEq'
import { DEFAULT_TIMEZONE, DEFAULT_LOCALE } from '../consts'
import supportDom from '../helpers/supportDom'

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

@supportDom
export default class DatepickerDateMenu {

  constructor({ date, startDate, endDate, options = {} }) {
    this.date = date
    this.date2 = addMonths(date, 1)
    this.startDate = startDate
    this.endDate = endDate
    this.hoveredCellData = null
    this.options = options
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.locale = options.locale || DEFAULT_LOCALE
    this.captionPattern = options.captionPattern || 'yyyy MMMM'
    this.weekHeaderItems = options.weekHeaderItems || DEFAULT_WEEK_HEADER_ITEMS
    this.isVisible = false
    this.init()
  }

  init() {
    this.addMenu()
    this.addEvents()
  }

  setHoveredCell(data) {
    const dataChanged = JSON.stringify(data) !== JSON.stringify(this.hoveredCellData)
    if (dataChanged && (! this.endDate)) {
      this.hoveredCellData = data
      this.drawTables()
    }
  }

  getTableRows(date) {

    const { startDate, endDate } = this

    const daysInMonth = getDaysInMonth(date)
    const firstDateOfMonth = startOfMonth(date)
    const toEmptyCell = () => ({ type: CELL_TYPE_EMPTY })

    const firstWeekday = getDay(startOfMonth(date))
    const beforeWeekday = ((firstWeekday - 1) === -1) ? 6 : (firstWeekday - 1)
    const emptyHeadRows = range(1, beforeWeekday).map(toEmptyCell)

    const initialStartDate = startOfDay(startDate)
    const initialEndDate = startOfDay(endDate)

    // 00:00:00
    // eslint-disable-next-line prefer-const
    let startOfStartDate = initialStartDate

    // eslint-disable-next-line prefer-const
    let startOfEndDate = initialEndDate

    if (startDate && (! endDate) && this.hoveredCellData) {
      const { year: y, month: m, date: d } = this.hoveredCellData
      startOfEndDate = set(startOfStartDate, { year: y, month: m, date: d })
      if (dateLt(startOfEndDate, startOfStartDate)) {
        [startOfStartDate, startOfEndDate] = [startOfEndDate, startOfStartDate]
      }
    }

    const rows = range(1, daysInMonth).map(day => {

      const d = addDays(firstDateOfMonth, day - 1)
      const resCompareStart = compareAsc(startOfStartDate, d)
      const resCompareEnd = compareAsc(startOfEndDate, d)

      return {
        type: CELL_TYPE_DAY,
        isStartDate: dateEq(initialStartDate, d),
        isEndDate: dateEq(initialEndDate, d),
        isSelected: (resCompareStart <= 0) && (resCompareEnd >= 0),
        day
      }
    })

    const lastWeekday = getDay(endOfMonth(date))
    const emptyDays = ((7 - lastWeekday) % 7)
    const emptyTailRows = range(1, emptyDays).map(toEmptyCell)

    return emptyHeadRows.concat(rows).concat(emptyTailRows)
  }

  setCaption() {
    const { date, date2 } = this
    const options = { timezone: this.tz, locale: this.locale }
    if (isTouchDevice()) {
      this.caption.textContent = format(date, this.captionPattern, options)
    }
    else {
      this.caption1.textContent = format(date, this.captionPattern, options)
      this.caption2.textContent = format(date2, this.captionPattern, options)
    }
  }

  drawTables() {
    if (isTouchDevice()) {
      const rows = this.getTableRows(this.date)
      this.table.innerHTML = this.getTableHtml(rows)
    }
    else {
      this.table1.innerHTML = this.getTableHtml(this.getTableRows(this.date))
      this.table2.innerHTML = this.getTableHtml(this.getTableRows(this.date2))
    }
  }

  setDate({ date, startDate, endDate }) {
    if (date) {
      this.date = date
      this.date2 = addMonths(date, 1)
      this.setCaption()
    }
    if (typeof startDate !== 'undefined') {
      this.startDate = startDate
    }
    if (typeof endDate !== 'undefined') {
      this.endDate = endDate
    }
    this.drawTables()
  }

  getWeekHeaderItems() {
    return this.weekHeaderItems.map(item => `<li>${item.text}</li>`)
      .join('')
  }

  getTableHtml(rows) {
    return rows.map((row, i) => {
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
    dom.className = 'datepicker-date-menu'

    if (isTouchDevice()) {
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
      this.caption = dom.querySelector('[data-menu-caption]')
      this.table = dom.querySelector('[data-date-table]')
      this.btnPrev = dom.querySelector('[data-btn-prev]')
      this.btnNext = dom.querySelector('[data-btn-next]')
    }
    else {
      dom.innerHTML = `
        <div class="datepicker-content">
          <div class="datepicker-caption" data-menu-caption1></div>
          <ul class="datepicker-week-header">
            ${this.getWeekHeaderItems()}
          </ul>
          <table class="datepicker-date-table" data-date-table1></table>
          <button class="datepicker-btn-prev" data-btn-prev>
            <i class="icon icon-chevron-left"></i>
          </button>
        </div>
        <div class="datepicker-content second-content">
          <div class="datepicker-caption" data-menu-caption2></div>
          <ul class="datepicker-week-header">
            ${this.getWeekHeaderItems()}
          </ul>
          <table class="datepicker-date-table" data-date-table2></table>
          <button class="datepicker-btn-next" data-btn-next>
            <i class="icon icon-chevron-right"></i>
          </button>
        </div>
      `
      this.caption1 = dom.querySelector('[data-menu-caption1]')
      this.caption2 = dom.querySelector('[data-menu-caption2]')
      this.table1 = dom.querySelector('[data-date-table1]')
      this.table2 = dom.querySelector('[data-date-table2]')
      this.btnPrev = dom.querySelector('[data-btn-prev]')
      this.btnNext = dom.querySelector('[data-btn-next]')
    }
    document.body.appendChild(dom)
    this.dom = dom
  }

  findTable(target) {
    let node = target
    while (node.parentNode) {
      node = node.parentNode
      if (node.tagName === 'TABLE') {
        return node
      }
    }
    return null
  }

  addEvents() {
    this.addEvent(this.btnPrev, 'click', event => {
      this.setDate({ date: subMonths(this.date, 1) })
    })

    this.addEvent(this.btnNext, 'click', () => {
      this.setDate({ date: addMonths(this.date, 1) })
    })

    if (isTouchDevice()) {
      this.addEvent(this.table, 'click', event => {
        if ('dateTableCell' in event.target.dataset) {
          const res = {
            year: getYear(this.date),
            month: getMonth(this.date),
            date: parseInt(event.target.textContent.trim(), 10)
          }
          this.fire('td-click', event, res)
        }
      })
    }
    else {
      this.addEvent(this.table1, 'click', event => {
        if ('dateTableCell' in event.target.dataset) {
          const res = {
            year: getYear(this.date),
            month: getMonth(this.date),
            date: parseInt(event.target.textContent.trim(), 10)
          }
          this.fire('td-click', event, res)
        }
      })
      this.addEvent(this.table2, 'click', event => {
        if ('dateTableCell' in event.target.dataset) {
          const res = {
            year: getYear(this.date2),
            month: getMonth(this.date2),
            date: parseInt(event.target.textContent.trim(), 10)
          }
          this.fire('td-click', event, res)
        }
      })
      this.addEvent(this.dom, 'mouseover', event => {
        if ('dateTableCell' in event.target.dataset) {
          const table = this.findTable(event.target)
          const date = ('dateTable1' in table.dataset) ? this.date : this.date2
          const res = {
            year: getYear(date),
            month: getMonth(date),
            date: parseInt(event.target.textContent.trim(), 10)
          }
          return this.fire('td-mouseover', event, res)
        }
        this.fire('td-mouseover', event, null)
      })
    }
  }

  pos(src) {
    const { dom } = this
    const { pos } = getFloatedTargetPos({
      src,
      target: dom,
      place: 'bottom',
      align: 'left',
      offset: 4
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
    this.caption = null
    this.btnPrev = null
    this.btnNext = null
    this.table = null
    this.dom.remove()
    this.menu = null
  }
}
