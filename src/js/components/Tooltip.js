import getFloatedTargetPos from '../utils/getFloatedTargetPos'
import supportDom from '../decorators/supportDom'
import { toPixel } from '../utils'

const TOOLTIP_PLACEMENTS = ['top', 'bottom', 'left', 'right']

@supportDom
export default class Tooltip {

  constructor(dom) {
    this.dom = dom
    this.tooltip = document.querySelector('[data-global-tooltip]')
    this.init()
  }

  init() {
    this.appendTooltip()
    this.addEvents()
  }

  appendTooltip() {
    if (this.tooltip) {
      return
    }
    const tooltip = document.createElement('div')
    tooltip.setAttribute('data-global-tooltip', '')
    tooltip.classList.add('tooltip')
    document.body.appendChild(tooltip)
    this.tooltip = tooltip
  }

  static remove() {
    const div = document.querySelector('[data-global-tooltip]')
    if (div) {
      div.remove()
    }
  }

  getPlace() {
    const str = this.dom.dataset.place
    return TOOLTIP_PLACEMENTS.includes(str) ? str : 'bottom'
  }

  getOffset() {
    const num = parseInt(this.dom.dataset.offset, 10)
    return Number.isInteger(num) ? num : 10
  }

  setTooltipMsg() {
    const { msg } = this.dom.dataset
    if (this.tooltip.innerHTML !== msg) {
      this.tooltip.innerHTML = msg
    }
  }

  hide() {
    const { tooltip } = this
    if (tooltip) {
      tooltip.style.opacity = 0
      tooltip.style.display = 'none'
    }
  }

  addEvents() {
    const { dom, tooltip } = this
    if ('onmouseover' in dom) {
      this.addEvent(dom, 'mouseover', () => {

        const msg = this.dom.dataset.msg || ''
        const style = this.dom.dataset.style || 'default'

        if (msg.length === 0) {
          return
        }

        this.setTooltipMsg()

        tooltip.style.opacity = 0
        tooltip.style.display = 'block'

        const { pos, place } = getFloatedTargetPos({
          src: dom,
          target: tooltip,
          place: this.getPlace(),
          offset: this.getOffset()
        })

        tooltip.className = (style === 'default') ? 'tooltip' : `tooltip tooltip-popover ${place}`

        tooltip.style.left = toPixel(pos.left)
        tooltip.style.top = toPixel(pos.top)
        tooltip.style.opacity = 1
      })
    }
    if ('onmouseleave' in dom) {
      const handleMouseLeave = () => this.hide()
      this.addEvent(dom, 'click', handleMouseLeave)
      this.addEvent(dom, 'mouseleave', handleMouseLeave)
    }
  }

  destroy() {
    this.hide()
  }
}
