import supportDom from '../decorators/supportDom'
import getFloatedTargetPos from '../utils/getFloatedTargetPos'
import isTouchDevice from '../utils/isTouchDevice'
import { DEFAULT_TIMEZONE, DEFAULT_LOCALE } from '../consts'
import {
  chunk,
  format,
  range,
  isFuture,
  setYear,
  setMonth,
  getYear,
  getMonth,
  addYears,
  toPixel,
  subYears,
  noop
} from '../utils'

@supportDom
export default class MonthMenu {

  constructor(options = {}) {
    const { dom, date } = options
    this.container = dom
    this.date = date
    this.menuDate = this.date || new Date()
    this.options = options
    this.tz = options.tz || DEFAULT_TIMEZONE
    this.locale = options.locale || DEFAULT_LOCALE
    this.futureDateDisabled = options.futureDateDisabled || true
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
    const { date, menuDate, locale, futureDateDisabled } = this

    const currentYear = date ? getYear(date) : null
    const currentMonth = date ? getMonth(date) : null

    return chunk(range(0, 12), 3)
      .map(months => {
        const tds = months.map(month => {
          const d = setMonth(menuDate, month)
          const text = format(d, 'MMM', { locale })

          const isCurrentMonth = (currentYear === getYear(d)) && (currentMonth === getMonth(d))

          let classname = 'cell'

          if (isCurrentMonth) {
            classname = 'cell selected-ex'
          }
          else if (futureDateDisabled && isFuture(d)) {
            classname = 'cell js-disabled'
          }

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
    const { container } = this
    const dom = document.createElement('div')
    dom.classList.add('month-menu')

    if (container) {
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
    if (container) {
      container.appendChild(dom)
    }
    else {
      document.body.appendChild(dom)
    }
    this.menuTitle = dom.querySelector('[data-month-menu-title]')
    this.prevBtn = dom.querySelector('[data-prev-month-btn]')
    this.nextBtn = dom.querySelector('[data-next-month-btn]')
    this.table = dom.querySelector('[data-month-table]')
    this.dom = dom
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

  stop(event) {
    event.preventDefault()
    event.stopPropagation()
  }

  addEvents() {
    const isTouch = isTouchDevice()
    const downEvent = isTouch ? 'touchstart' : 'mousedown'

    this.addEvent(this.prevBtn, downEvent, event => {
      this.stop(event)
      const currentYear = getYear(this.menuDate)
      if ((currentYear - 1) <= 0) {
        return
      }
      this.subYear()
      this.subYearLoop()
    })

    this.addEvent(this.nextBtn, 'click', event => event.stopPropagation())
    this.addEvent(this.prevBtn, 'click', event => event.stopPropagation())

    this.addEvent(this.nextBtn, downEvent, event => {
      this.stop(event)
      this.addYear()
      this.addYearLoop()
    })

    const upEvent = isTouch ? 'touchend' : 'mouseup'
    this.addEvent(this.prevBtn, upEvent, event => {
      this.stop(event)
      this.clearSubYearLoop()
    })
    this.addEvent(this.nextBtn, upEvent, event => {
      this.stop(event)
      this.clearAddYearLoop()
    })

    this.addEvent(this.table, 'click', event => {
      this.stop(event)
      const { target } = event
      if ('monthTd' in target.dataset) {
        const year = getYear(this.menuDate)
        const month = parseInt(target.dataset.monthTd, 10)

        if (target.classList.contains('js-disabled')) {
          return
        }

        if (! this.date) {
          this.date = new Date(this.menuDate.getTime())
        }

        this.date = setYear(this.date, year)
        this.date = setMonth(this.date, month)
        this.updateTableContent()
        this.emitChange()
      }
    })
  }

  setDate(date) {
    this.date = date
    this.menuDate = date
    this.setTitle(date)
    this.updateTableContent()
  }

  emitChange() {
    this.change(this.date)
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
    dom.style.display = 'block'
    if (src) {
      this.pos(src)
    }
    dom.style.opacity = 1
    this.isVisible = true
  }

  hide() {
    this.dom.style.display = 'none'
    this.isVisible = false
  }

  destroy() {
    this.menuTitle = null
    this.prevBtn = null
    this.nextBtn = null
    this.table = null
    this.dom.remove()
  }
}
