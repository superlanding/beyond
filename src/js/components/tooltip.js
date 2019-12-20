import getFloatedTargetPos from '../helpers/getFloatedTargetPos'
import toPixel from '../helpers/toPixel'

const TOOLTIP_PLACEMENTS = ['top', 'bottom', 'left', 'right']

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

  addEvents() {
    const { dom, tooltip } = this
    if ('onmouseover' in dom) {
      dom._handleMouseOver = () => {
        if (window.beyond._TOOLTIP_MOUSELEAVE_TIMEOUT) {
          clearTimeout(window.beyond._TOOLTIP_MOUSELEAVE_TIMEOUT)
          window.beyond._TOOLTIP_MOUSELEAVE_TIMEOUT = null
        }
        this.setTooltipMsg()

        tooltip.style.opacity = 0
        tooltip.style.display = 'block'

        const pos = getFloatedTargetPos({
          src: dom,
          target: tooltip,
          place: this.getPlace(),
          offset: this.getOffset()
        })
        tooltip.style.left = toPixel(pos.left)
        tooltip.style.top = toPixel(pos.top)
        tooltip.style.opacity = 1
      }
      dom.addEventListener('mouseover', dom._handleMouseOver, false)
    }
    if ('onmouseleave' in dom) {
      dom._handleMouseLeave = () => {
        window.beyond._TOOLTIP_MOUSELEAVE_TIMEOUT = setTimeout(() => {
          tooltip.style.opacity = 0
          window.beyond._TOOLTIP_MOUSELEAVE_TIMEOUT = setTimeout(() => {
            tooltip.style.display = 'none'
          }, 300)
        }, 200)
      }
      dom.addEventListener('click', dom._handleMouseLeave, false)
      dom.addEventListener('mouseleave', dom._handleMouseLeave, false)
    }
  }

  destroy() {
    const { dom } = this
    if ('onmouseover' in dom) {
      dom.removeEventListener('mouseover', dom._handleMouseOver, false)
    }
    if ('onmouseleave' in dom) {
      dom.removeEventListener('click', dom._handleMouseLeave, false)
      dom.removeEventListener('mouseleave', dom._handleMouseLeave, false)
    }
  }
}
