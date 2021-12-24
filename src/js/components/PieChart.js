import supportDom from '../decorators/supportDom'
import chartCommon from '../decorators/chartCommon'
import isFn from '../utils/isFn'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'
import { throttle } from '../utils'
import { THEME_DEFAULT, CHART_STYLE } from '../consts'

@supportDom
@chartCommon
export default class PieChart {

  constructor(dom, options = {}) {
    this.dom = dom
    this.data = []
    this.total = 0

    this.options = options
    this.labelVisible = isDef(options.labelVisible) ? options.labelVisible : true
    this.height = options.height
    this.width = options.width
    this.padding = isDef(options.padding) ? options.padding : 30
    this.setTheme(options)

    this.init()
  }

  init() {
    this.setDpr()
    this.setDomSizeIfNeeded()
    this.setCanvas()
    this.setLabelBox()
    this.clear()
    this.bindMedia()
    this.bindPointMouseOver()
  }

  setTheme(options) {
    const theme = options.theme || THEME_DEFAULT
    const style = CHART_STYLE[theme]
    this.theme = theme
    this.bg = options.bg || style.bg
    this.glowAlpha = options.glowAlpha || style.glowAlpha
    this.styles = options.styles || style.variants
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

    this.fillCircle(ctx, x, y, centerCircleRadius, this.bg)
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
    const canvasMousePos = this.getMousePosInCanvas(event)
    const mousePos = this.getMousePos(canvasMousePos)
    const mouseX = canvasMousePos.x
    const mouseY = canvasMousePos.y

    const distanceToCenterPoint = Math.sqrt(Math.pow(mouseX - x, 2) +
      Math.pow(mouseY - y, 2))

    const inCenterCircle = distanceToCenterPoint <= this.centerCircleRadius

    this.clearSliceGlow()

    if (inCenterCircle) {
      return this.options.onPieMouseOver(mousePos, null)
    }

    const inPieCircle = distanceToCenterPoint <= this.radius
    if (! inPieCircle) {
      return this.options.onPieMouseOver(mousePos, null)
    }
    const angle = this.getPosAngle(x, y, mouseX, mouseY)
    const matchedRow = this.data.find(row => {
      return (row.startAngle <= angle) && (angle <= row.endAngle)
    })
    if (matchedRow) {
      this.drawSliceGlow(matchedRow)
      this.options.onPieMouseOver(mousePos, matchedRow)
    }
  }

  drawSliceGlow(row) {
    const index = this.data.findIndex(r => r === row)
    this.clearSliceGlow()
    const { x, y, radius, centerCircleRadius } = this
    const ctx = this.firstLayer.canvas.getContext('2d')

    const delta = 90 * Math.PI / 180
    const startAngle = (row.startAngle * Math.PI / 180) - delta
    const endAngle = (row.endAngle * Math.PI / 180) - delta

    const options = {
      style: this.styles[index],
      alpha: this.glowAlpha
    }
    const radiusDelta = (radius - centerCircleRadius) * .3
    this.fillArc(ctx, x, y, radius + radiusDelta, startAngle, endAngle, options)
    this.fillCircle(this.firstLayer.ctx, x, y, centerCircleRadius, this.bg)
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

  handleLabelMouseOver(event, index) {
    const row = this.data[index]
    this.drawSliceGlow(row)

    if (isFn(this.options.onLabelMouseOver)) {
      const canvasMousePos = this.getMousePosInCanvas(event)
      const mousePos = this.getMousePos(canvasMousePos)
      this.options.onLabelMouseOver(mousePos, row)
    }
  }

  handleLabelMouseLeave(event, index) {
    this.clearSliceGlow()

    if (isFn(this.options.onLabelMouseOver)) {
      const canvasMousePos = this.getMousePosInCanvas(event)
      const mousePos = this.getMousePos(canvasMousePos)
      this.options.onLabelMouseOver(mousePos)
    }
  }

  setData(arr) {
    const data = arr || []
    this.total = data.reduce((t, row) => t + row.value, 0)
    this.data = this.setAngles(data)
    this.raf(() => {
      if (this.labelVisible) {
        const labels = this.data.map(row => row.label)
        this.drawLabels(labels, this.styles)
      }
      this.draw()
    })
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
