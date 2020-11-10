import supportDom from '../decorators/supportDom'
import isTouchDevice from '../utils/isTouchDevice'
import { DEFAULT_TIMEZONE, DEFAULT_LOCALE } from '../consts'
import {
  chunk,
  format,
  range,
  setMonth,
  getYear,
  addYears,
  subYears
} from '../utils'

@supportDom
export default class MonthMenu {

  constructor({ dom, date, options = {} }) {
    this.dom = dom
    this.date = date
    this.options = options
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.locale = options.locale || DEFAULT_LOCALE
    this.isVisible = false
    this.loopIndex = 0
    this.init()
  }

  init() {
    this.addMenu()
    this.addEvents()
  }

  renderTableContent() {
    const { date, locale } = this
    return chunk(range(0, 12), 3)
      .map(months => {
        const tds = months.map(month => {
        const d = setMonth(date, month)
        const text = format(d, 'MMM', { locale })
        return `<td class="cell">${text}</td>`
       })
       .join('')
       return `<tr>${tds}</tr>`
      })
      .join('')
  }

  addMenu() {
    const isStatic = (!! this.dom)
    const dom = document.createElement('div')
    dom.classList.add('month-menu')
    if (isStatic) {
      dom.classList.add('static')
    }
    const title = getYear(this.date)
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
        <table class="month-menu-table">
          ${this.renderTableContent()}
        </table>
      </div>
    `
    if (isStatic) {
      this.dom.appendChild(dom)
      this.menuTitle = this.dom.querySelector('[data-month-menu-title]')
      this.prevBtn = this.dom.querySelector('[data-prev-month-btn]')
      this.nextBtn = this.dom.querySelector('[data-next-month-btn]')
    }
  }

  setTitle(date) {
    this.menuTitle.textContent = getYear(date)
  }

  addYear(year = 1) {
    this.date = addYears(this.date, year)
    this.setTitle(this.date)
  }

  subYear(year = 1) {
    this.date = subYears(this.date, year)
    this.setTitle(this.date)
  }

  subYearLoop() {
    const duration = (this.loopIndex === 0) ? 500 : 100
    this.subYearTimer = setTimeout(() => {
      this.loopIndex += 1
      const year = parseInt((this.loopIndex / 10) + 1, 5)
      this.subYear(year)
      this.subYearLoop()
    }, duration)
    this.loopIndex += 1
  }

  clearSubYearLoop() {
    clearTimeout(this.subYearTimer)
    this.loopIndex = 0
  }

  addYearLoop() {
    const duration = (this.loopIndex === 0) ? 500 : 100
    this.addYearTimer = setTimeout(() => {
      this.loopIndex += 1
      const year = parseInt((this.loopIndex / 10) + 1, 5)
      this.addYear(year)
      this.addYearLoop()
    }, duration)
    this.loopIndex += 1
  }

  clearAddYearLoop() {
    clearTimeout(this.addYearTimer)
    this.loopIndex = 0
  }

  addEvents() {
    const isTouch = isTouchDevice()
    const downEvent = isTouch ? 'touchstart' : 'mousedown'

    this.addEvent(this.prevBtn, downEvent, () => {
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
