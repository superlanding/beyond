import getFloatedTargetPos from '../utils/getFloatedTargetPos'
import toPixel from '../utils/toPixel'
import supportDom from '../utils/supportDom'
import { getHours, getMinutes, range } from '../utils'

@supportDom
export default class TimeMenu {

  constructor() {
    this.date = null
    this.isVisible = false
    this.init()
  }

  init() {
    this.addMenu()
    this.addEvents()
  }

  getMenuItems(step) {
    const dayMins = 24 * 60
    return range(0, dayMins, step)
      .reduce((arr, mins) => {
        const hour = parseInt(mins / 60, 10)
        const min = mins % 60
        arr.push({ hour, min })
        return arr
      }, [])
      .map(({ hour, min }) => {
        return `<div class="time-menu-item"
          data-hour="${hour}"
          data-minute="${min}">${hour}:${min.toString().padStart(2, '0')}</div>`
      })
      .join('')
  }

  addMenu() {
    const dom = document.createElement('div')
    dom.className = 'time-menu'
    document.body.appendChild(dom)
    this.dom = dom
  }

  addEvents() {
    this.addEvent(this.dom, 'click', event => {
      const { dataset } = event.target
      if ('hour' in dataset) {
        const res = {
          hour: parseInt(dataset.hour, 10),
          minute: parseInt(dataset.minute, 10)
        }
        this.fire('click', event, res)
      }
    })
  }

  pos(src) {
    const { dom } = this
    const { pos } = getFloatedTargetPos({
      src,
      target: dom,
      place: 'bottom',
      align: 'right',
      offset: 4
    })
    dom.style.left = toPixel(pos.left)
    dom.style.top = toPixel(pos.top)
  }

  setActiveNode(node, active) {
    if (active) {
      return node.classList.add('active')
    }
    node.classList.remove('active')
  }

  updateItems(date) {
    const hour = getHours(date).toString()
    const minute = getMinutes(date).toString()
    Array.from(this.dom.childNodes)
      .forEach(node => {
        const { hour: datasetHour, minute: datasetMinute } = node.dataset
        const hourEqualed = (datasetHour === hour)
        const minuteEqualed = (datasetMinute === minute)

        if (hourEqualed && (datasetMinute === '0')) {
          this.dom.scrollTop = node.offsetTop
        }
        const active = (hourEqualed && minuteEqualed)
        this.setActiveNode(node, active)
      })
  }

  show({ src, date, step = 30 }) {
    const { dom } = this
    dom.innerHTML = this.getMenuItems(step)
    dom.style.opacity = 0
    dom.style.display = 'block'
    this.pos(src)
    this.updateItems(date)
    dom.style.opacity = 1
    this.isVisible = true
  }

  hide() {
    this.dom.style.left = '-100%'
    this.dom.style.bottom = '-100%'
    this.dom.style.display = 'none'
    this.isVisible = false
  }

  destroy() {
    this.dom.remove()
  }
}
