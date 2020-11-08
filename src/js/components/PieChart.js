import supportDom from '../decorators/supportDom'
import chartCommon from '../decorators/chartCommon'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'
import { throttle } from '../utils'

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
    this.total = 0

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

  get centerCircleRadius() {
    return this.radius - this.pieWidth
  }

  get contentWidth() {
    return this.width - (this.padding * 2)
  }

  get contentHeight() {
    return this.height - (this.padding * 2)
  }

  bindPointMouseOver() {
    if (isUndef(this.options.onPieMouseOver)) {
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
    const { x, y, radius, centerCircleRadius, ctx, total } = this

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

    this.fillCircle(ctx, x, y, centerCircleRadius, '#fff')
  }

  handleDprChange() {
    this.setDpr()
    this.refresh()
  }

  getPosAngle(x1, y1, x2, y2) {

    let x = x2
    let y = y2

    if (x1 >= 0) {
      x -= x1
    }
    if (y1 >= 0) {
      y -= y1
    }
    if (x1 < 0) {
      x += x1
    }
    if (y2 < 0) {
      y += y2
    }

    let angle = Math.atan2(y, x) * 180 / Math.PI
    if (angle < 0) {
      angle = 180 + (180 + angle)
    }
    return (angle + 90) % 360
  }

  handleMouseMove(event) {

    const { x, y } = this
    const { x: mouseX, y: mouseY } = this.getMousePosInCanvas(event)

    const distanceToCenterPoint = Math.sqrt(Math.pow(mouseX - x, 2) +
      Math.pow(mouseY - y, 2))

    const inCenterCircle = distanceToCenterPoint <= this.centerCircleRadius

    this.clearSliceGlow()

    if (inCenterCircle) {
      return
    }

    const inPieCircle = distanceToCenterPoint <= this.radius
    if (! inPieCircle) {
      return
    }
    const angle = this.getPosAngle(x, y, mouseX, mouseY)
    const index = this.data.findIndex(row => {
      return (row.startAngle <= angle) && (angle <= row.endAngle)
    })
    const matchedRow = this.data[index]
    if (matchedRow) {
      this.drawSliceGlow(matchedRow, index)
    }
  }

  drawSliceGlow(row, index) {
    this.clearSliceGlow()
    const { x, y, radius, centerCircleRadius } = this
    const ctx = this.firstLayer.canvas.getContext('2d')

    const delta = 90 * Math.PI / 180
    const startAngle = (row.startAngle * Math.PI / 180) - delta
    const endAngle = (row.endAngle * Math.PI / 180) - delta

    const options = {
      style: this.styles[index],
      alpha: .3
    }
    const radiusDelta = (radius - centerCircleRadius) * .3
    this.fillArc(ctx, x, y, radius + radiusDelta, startAngle, endAngle, options)
    this.fillCircle(this.firstLayer.ctx, x, y, centerCircleRadius, '#fff')
  }

  clearSliceGlow() {
    const ctx = this.firstLayer.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.width, this.height)
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

  setAngles(data) {
    const { total } = this
    let startAngle = 0
    return data.map(row => {
      const endAngle = startAngle + ((row.value / total) * 360)
      const nextRow = Object.assign({}, row, { startAngle, endAngle })
      startAngle = endAngle
      return nextRow
    })
  }

  setData(data) {
    this.total = data.reduce((t, row) => t + row.value, 0)
    this.data = this.setAngles(data)
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
