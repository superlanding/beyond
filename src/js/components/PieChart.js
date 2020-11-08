import supportDom from '../decorators/supportDom'
import chartCommon from '../decorators/chartCommon'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'

const defaultStyles = [
  '#5469d4',
  '#7c54d4',
  '#a254d4'
]

@supportDom
@chartCommon
export default class PieChart {

  constructor(dom, options = {}) {
    this.dom = dom
    this.data = []

    this.options = options
    this.height = options.height
    this.width = options.width
    this.padding = isDef(options.padding) ? options.padding : 40
    this.styles = options.styles || defaultStyles
    this.bgColor = options.bgColor || '#fff'

    this.init()
  }

  init() {
    this.setDpr()
    this.setDomSizeIfNeeded()
    this.setCanvas()
    this.clear()
    this.bindMedia()
    this.bindPointMouseOver()
  }

  get x() {
    return this.width / 2
  }

  get y() {
    return this.height / 2
  }

  get radius() {
    return this.contentWidth / 2
  }

  get pieWidth() {
    return this.radius * .3
  }

  get circleRadius() {
    return this.radius - this.pieWidth
  }

  get contentWidth() {
    return this.width - (this.padding * 2)
  }

  get contentHeight() {
    return this.height - (this.padding * 2)
  }

  bindPointMouseOver() {
    if (isUndef(this.options.onPointMouseOver)) {
      return
    }
    if (! ('onmousemove' in this.canvas)) {
      return
    }
    this.addLayer()
    const canvas = this.getHighestCanvas()
    this.addEvent(canvas, 'mousemove', throttle(this.handleMouseMove.bind(this), 30))
  }

  draw() {
    this.clear()
    this.drawPie()
  }

  drawPie() {
    const total = this.data.reduce((t, row) => t + row.value, 0)
    const { x, y, radius, circleRadius, ctx, contentWidth, width, height } = this

    let distance = 0

    this.data.forEach((row, i) => {

      const ratio = (row.value / total)
      const startAngle = Math.PI * (-.5 + 2 * distance)
      const endAngle = Math.PI * (-.5 + 2 * (distance + ratio))

      const options = {
        style: this.styles[i]
      }
      this.fillArc(ctx, x, y, radius, startAngle, endAngle, options)
      distance += ratio
    })

    this.fillCircle(ctx, x, y, circleRadius, '#fff')
  }

  handleDprChange() {
    this.setDpr()
    this.refresh()
  }

  handleMouseMove(event) {
  }

  refresh() {
    this.raf(() => {
      this.clearCanvasSize(this.canvas)
      this.layers.forEach(layer => this.clearCanvasSize(layer.canvas))
      this.setDomSizeIfNeeded()
      this.setCanvasSize(this.canvas)
      this.layers.forEach(layer => this.setCanvasSize(layer.canvas))
      this.draw()
    })
  }

  setData(data) {
    this.data = data
    this.raf(() => this.draw())
  }

  destroy() {
    const { dom, canvas } = this

    this.unbindMedia()
    this.removeAllLayers()

    if (dom.contains(canvas)) {
      dom.removeChild(canvas)
      dom.style.removeProperty('position')
    }
  }
}
