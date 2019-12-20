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

  getPlacement() {
    const str = this.dom.dataset.placement
    return TOOLTIP_PLACEMENTS.includes(str) ? str : 'bottom'
  }

  getOffset() {
    const num = parseInt(this.dom.dataset.offset, 10)
    return Number.isInteger(num) ? num : 10
  }

  toPixel(num) {
    return parseInt(num, 10) + 'px'
  }

  getPos({ src, target, placement, offset }) {

    const x1 = src.offsetLeft
    const y1 = src.offsetTop
    const w1 = src.offsetWidth
    const h1 = src.offsetHeight

    const w2 = target.offsetWidth
    const h2 = target.offsetHeight

    switch (placement) {
      case 'top': {
        const left = x1 + (w1 / 2) - (w2 / 2)
        const top = y1 - offset - h2
        return { left, top }
      }
      case 'bottom': {
        const left = x1 + (w1 / 2) - (w2 / 2)
        const top = y1 + h1 + offset
        return { left, top }
      }
      case 'left': {
        const left = x1 - offset - w2
        const top = y1 + (w1 / 2) - (h2 / 2)
        return { left, top }
      }
      case 'right': {
        const left = x1 + w1 + offset
        const top = y1 + (h1 / 2) - (h2 / 2)
        return { left, top }
      }
      default:
        throw new Error(`Unsupported Placement: ${placement}`)
    }
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

        const pos = this.getPos({
          src: dom,
          target: tooltip,
          placement: this.getPlacement(),
          offset: this.getOffset()
        })
        tooltip.style.left = this.toPixel(pos.left)
        tooltip.style.top = this.toPixel(pos.top)
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
    if ('onmouseover' in this.dom) {
      this.dom.removeEventListener('mouseover', this.dom._handleMouseOver, false)
    }
    if ('onmouseleave' in this.dom) {
      this.dom.removeEventListener('click', this.dom._handleMouseLeave, false)
      this.dom.removeEventListener('mouseleave', this.dom._handleMouseLeave, false)
    }
  }
}
