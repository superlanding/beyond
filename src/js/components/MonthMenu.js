import supportDom from '../decorators/supportDom'
import isTouchDevice from '../utils/isTouchDevice'
import { DEFAULT_TIMEZONE, DEFAULT_LOCALE } from '../consts'
import {
  chunk,
  format,
  range,
  setYear,
  setMonth,
  getYear,
  getMonth,
  addYears,
  subYears,
  noop
} from '../utils'

@supportDom
export default class MonthMenu {

  constructor({ dom, date, options = {} }) {
    this.dom = dom
    this.date = date || new Date()
    this.menuDate = this.date
    this.options = options
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.locale = options.locale || DEFAULT_LOCALE
    this.change = options.change || noop
    this.isVisible = false
    this.loopIndex = 0
    this.init()
  }

  init() {
    this.addMenu()
    this.addEvents()
  }

  renderTableContent() {
    const { date, menuDate, locale } = this
    const currentYear = getYear(date)
    const currentMonth = getMonth(date)

    return chunk(range(0, 12), 3)
      .map(months => {
        const tds = months.map(month => {
          const d = setMonth(menuDate, month)
          const text = format(d, 'MMM', { locale })
          const isCurrentMonth = (currentYear === getYear(d)) && (currentMonth === getMonth(d))
          const classname = isCurrentMonth ? 'cell selected' : 'cell'
          return `<td class="${classname}" data-month-td="${month}">${text}</td>`
        }).join('')
        return `<tr>${tds}</tr>`
      })
      .join('')
  }

  updateTableContent() {
    this.table.innerHTML = this.renderTableContent()
  }

  addMenu() {
    const isStatic = (!! this.dom)
    const dom = document.createElement('div')
    dom.classList.add('month-menu')
    if (isStatic) {
      dom.classList.add('static')
    }
    const title = getYear(this.menuDate)
    dom.innerHTML = `
      <div class="month-menu-content">
        <div class="month-menu-caption">
          <button class="month-menu-caption-btn"
                  type="button"
                  data-prev-month-btn>
            <i class="icon-chevron-left"></i>
          </button>
          <div data-month-menu-title>${title}</div>
          <button class="month-menu-caption-btn"
                  type="button"
                  data-next-month-btn>
            <i class="icon-chevron-right"></i>
          </button>
        </div>
        <table class="month-menu-table"
               data-month-table>
          ${this.renderTableContent()}
        </table>
      </div>
    `
    if (isStatic) {
      const container = this.dom
      container.appendChild(dom)
      this.menuTitle = container.querySelector('[data-month-menu-title]')
      this.prevBtn = container.querySelector('[data-prev-month-btn]')
      this.nextBtn = container.querySelector('[data-next-month-btn]')
      this.table = container.querySelector('[data-month-table]')
    }
  }

  setTitle(date) {
    this.menuTitle.textContent = getYear(date)
  }

  addYear(year = 1) {
    this.menuDate = addYears(this.menuDate, year)
    this.setTitle(this.menuDate)
    this.updateTableContent()
  }

  addYearLoop() {
    const duration = (this.loopIndex === 0) ? 500 : 100
    this.addYearTimer = setTimeout(() => {
      this.loopIndex += 1
      const year = parseInt((this.loopIndex / 5) + 1, 10)
      this.addYear(year)
      this.addYearLoop()
    }, duration)
  }

  clearAddYearLoop() {
    clearTimeout(this.addYearTimer)
    this.loopIndex = 0
  }

  subYear(year = 1) {
    this.menuDate = subYears(this.menuDate, year)
    this.setTitle(this.menuDate)
    this.updateTableContent()
  }

  subYearLoop() {
    const duration = (this.loopIndex === 0) ? 500 : 100
    this.subYearTimer = setTimeout(() => {
      this.loopIndex += 1
      const year = parseInt((this.loopIndex / 5) + 1, 10)
      const currentYear = getYear(this.menuDate)
      if ((currentYear - year) > 0) {
        this.subYear(year)
        this.subYearLoop()
      }
    }, duration)
  }

  clearSubYearLoop() {
    clearTimeout(this.subYearTimer)
    this.loopIndex = 0
  }

  addEvents() {
    const isTouch = isTouchDevice()
    const downEvent = isTouch ? 'touchstart' : 'mousedown'

    this.addEvent(this.prevBtn, downEvent, () => {
      const currentYear = getYear(this.menuDate)
      if ((currentYear - 1) <= 0) {
        return
      }
      this.subYear()
      this.subYearLoop()
    })

    this.addEvent(this.nextBtn, downEvent, () => {
      this.addYear()
      this.addYearLoop()
    })

    const upEvent = isTouch ? 'touchend' : 'mouseup'
    this.addEvent(this.prevBtn, upEvent, () => {
      this.clearSubYearLoop()
    })
    this.addEvent(this.nextBtn, upEvent, () => {
      this.clearAddYearLoop()
    })

    this.addEvent(this.table, 'click', event => {
      const { target } = event
      if ('monthTd' in target.dataset) {
        const year = getYear(this.menuDate)
        const month = parseInt(target.dataset.monthTd, 10)
        this.date = setYear(this.date, year)
        this.date = setMonth(this.date, month)
        this.updateTableContent()
        this.emitChange()
      }
    })
  }

  emitChange() {
    this.change(this.date)
  }

  show() {
    this.dom.style.display = 'block'
  }

  hide() {
    this.dom.style.display = 'none'
  }

  destroy() {
  }
}
