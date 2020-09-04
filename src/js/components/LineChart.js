import supportDom from '../utils/supportDom'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'
import { uniqBy, sortBy, range, toPixel, mem, throttle } from '../utils'

/**
 * -------------------------------------------------------------------------------------------------
 *                                            ^                                                     |
 *                                            |                                                     |
 *                                        yPadding                                                  |
 *                                            |                                                     |
 *                                            v                                                     |
 *                ----------------------------------------------------------- yLabel                |
 *                ----------------------------------------------------------- yLabel                |
 * <- xPadding -> ----------------------------------------------------------- yLabel <- xPadding -> |
 *                ----------------------------------------------------------- yLabel                |
 *                                                                              ^                   |
 *                                                                           yGutter                |
 *                                                                              v                   |
 *                ----------------------------------------------------------- yLabel                |
 *                xLabel   <- xGutter ->    xLabel   <- xGutter ->     xLabel                       |
 *                                            ^                                                     |
 *                                            |                                                     |
 *                                         yPadding                                                 |
 *                                            |                                                     |
 *                                            v                                                     |
 * --------------------------------------------------------------------------------------------------
 **/
const defaultLineStyles = [
  '#5469d4',
  '#7c54d4',
  '#a254d4'
]

@supportDom
export default class LineChart {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
    this.pointsArr = []
    this.height = options.height || 150
    this.width = options.width || dom.offsetWidth

    this.toXLabel = isDef(options.toXLabel) ? mem(options.toXLabel) : (v => v)
    this.toYLabel = isDef(options.toYLabel) ? mem(options.toYLabel) : (v => v)

    this.xPadding = isDef(options.xPadding) ? options.xPadding : 20
    this.yPadding = isDef(options.yPadding) ? options.yPadding : 20

    this.xLabelWidth = options.xLabelWidth
    this.xLabelHeight = options.xLabelHeight
    this.yLabelWidth = options.yLabelWidth
    this.yLabelHeight = options.yLabelHeight

    this.xGutter = isDef(options.xGutter) ? options.xGutter : 100
    this.yGutter = isDef(options.yGutter) ? options.yGutter : 10

    this.xLabelMargin = isDef(options.xLabelMargin) ? options.xLabelMargin : 10
    this.yLabelMargin = isDef(options.yLanelMargin) ? options.yLabelMargin : 10

    this.lineStyles = options.lineStyles || defaultLineStyles

    this.bgColor = options.bgColor || '#fff'
    this.fontSize = options.fontSize || 12

    this.xStep = options.xStep
    this.yStep = options.yStep

    this.lineLabels = options.lineLabels || []
    this.lineLabelMargin = isDef(options.lineLabelMargin) ? options.lineLabelMargin : 20
    this.layers = []

    this.xLabelRows = []
    this.yLabelRows = []

    this.init()
  }

  init() {
    this.setDpr()
    this.setCanvas()
    this.clear()
    this.bindMedia()
    this.bindPointVisible()
  }

  addLayer() {
    const { dom } = this
    const canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    canvas.style.top = 0
    canvas.style.left = 0
    canvas.style.right = 0
    canvas.style.bottom = 0
    const ctx = canvas.getContext('2d')

    this.setCanvasSize(canvas)
    this.layers.push({ canvas, ctx })

    dom.style.position = 'relative'
    dom.appendChild(canvas)
  }

  bindMedia() {
    if (this.media) {
      return
    }
    this.media = window.matchMedia(`(resolution: ${this.dpr}dppx)`)
    this._handleDprChange = this.handleDprChange.bind(this)
    this.media.addListener(this._handleDprChange)
  }

  bindPointVisible() {
    if (isUndef(this.options.onPointVisible)) {
      return
    }
    if (! ('onmousemove' in this.canvas)) {
      return
    }
    this.addLayer()
    const highestLayer = this.layers[this.layers.length - 1]
    this.addEvent(highestLayer.canvas, 'mousemove', throttle(this.handleMouseMove.bind(this), 30))
  }

  clear() {
    this.ctx.fillStyle = this.bgColor
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  draw() {
    this.clear()
    this.drawXAxis()
    this.drawYAxis()
    this.drawBgLines()
    this.drawLines()
    this.drawLineLables()
  }

  getYAxisStart() {
    return this.height - this.yPadding - this.getLineLabelBoxHeight() -
      this.xLabelHeight - this.xLabelMargin + (this.yLabelHeight / 2)
  }

  getYAxisEnd() {
    const distance = this.getYDistance()
    return this.getYAxisStart() - ((this.yLabelRows.length - 1) * distance)
  }

  getYDistance() {
    return this.getContentHeight() / (this.yLabelRows.length - 1)
  }

  drawBgLines() {

    const distance = this.getYDistance()
    const { ctx } = this
    const contentWidth = this.getContentWidth()
    const x = this.xPadding
    let y = this.getYAxisStart()

    ctx.strokeStyle = 'rgba(224, 224, 224, .5)'
    ctx.lineWidth = 1

    this.yLabelRows.forEach(row => {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + contentWidth, y)
      ctx.stroke()
      ctx.closePath
      y -= distance
    })
  }

  drawLines() {
    const { ctx, lineStyles } = this
    ctx.lineWidth = 2

    this.pointsArr.forEach((points, i) => {
      ctx.beginPath()
      ctx.strokeStyle = lineStyles[i] ? lineStyles[i] : '#000'
      points.forEach(p => {
        if (p._pos) {
          const pos = p._pos
          ctx.lineTo(pos.x, pos.y)
        }
      })
      ctx.stroke()
      ctx.closePath()
    })
  }

  drawLineLables() {
    const { ctx, lineStyles } = this
    const rectSize = 7

    const rectGutter = 7
    const labelGutter = 14
    const rectMargin = 1
    const y = this.height - this.yPadding
    const labelHeight = this.getLineLabelHeight()
    let x = this.xPadding

    this.lineLabels.forEach((name, i) => {
      ctx.fillStyle = lineStyles[i] || '#000'
      ctx.fillRect(x, y - labelHeight + rectMargin, rectSize, rectSize)

      x += (rectSize + rectGutter)
      ctx.fillStyle = '#000'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(name, x, y - labelHeight)
      x += (ctx.measureText(name).width + labelGutter)
    })
  }

  clearVerticalLine() {
    const { ctx } = this.layers[0]
    ctx.clearRect(0, 0, this.width, this.height)
  }

  drawVerticalLine(point, index) {
    const { ctx } = this.layers[0]
    const pos = point._pos
    const style = this.lineStyles[index] || '#000'
    ctx.strokeStyle = style
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(pos.x, 0)
    ctx.lineTo(pos.x, this.height)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI)
    ctx.fillStyle = style
    ctx.fill()
    ctx.closePath()
  }

  drawXAxis() {
    const { ctx } = this
    let x = this.xPadding
    const distance = this.getContentWidth() / (this.xLabelRows.length - 1)
    const y = this.height - this.yPadding - this.getLineLabelBoxHeight()

    const scaleMargin = 4
    const scaleSize = 4
    const scaleStart = y - scaleMargin - scaleSize
    const scaleEnd = y - scaleMargin

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#3c4257'
    ctx.textAlign = 'center'

    ctx.strokeStyle = '#3c4257'

    this.xLabelRows.forEach((row, i) => {
      ctx.beginPath()
      ctx.moveTo(x, scaleStart)
      ctx.lineTo(x, scaleEnd)
      ctx.stroke()
      ctx.closePath()

      ctx.fillText(row.label, x, y)
      x += distance
    })
  }

  drawYAxis() {
    const { ctx } = this
    const x = this.width - this.xPadding
    const halfYLabelHeight = this.yLabelHeight / 2
    let y = this.height - this.yPadding - this.getLineLabelBoxHeight() -
      this.xLabelHeight - this.xLabelMargin

    const distance = this.getContentHeight() / (this.yLabelRows.length - 1)

    ctx.textBaseline = 'center'
    ctx.fillStyle = '#3c4257'
    ctx.textAlign = 'right'

    this.yLabelRows.forEach(row => {
      ctx.fillText(row.label, x, y)
      y -= distance
    })
  }

  findClosetPoint(mousePos) {
    const { pointsArr } = this
    let i = 0
    for (const points of pointsArr) {
      for (const p of points) {
        if (isUndef(p._pos)) {
          continue
        }
        if (this.inDetectedZone(mousePos, p._pos)) {
          return {
            index: i,
            point: p
          }
        }
      }
      i++
    }
  }

  getMousePos(event) {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  handleDprChange() {
    this.setDpr()
    this.refresh()
  }

  handleMouseMove(event) {

    const mousePos = this.getMousePos(event)
    const res = this.findClosetPoint(mousePos)

    this.raf(() => {
      this.clearVerticalLine()
      if (res) {
        this.drawVerticalLine(res.point, res.index)
      }
      // only fires if res differs
      if (this.lastClosetPointRes !== res) {
        this.options.onPointVisible(event, mousePos, res)
      }
      this.lastClosetPointRes = res
    })
  }

  inDetectedZone(mousePos, pointPos) {
    const zoneLength = 14
    const { x: mouseX, y: mouseY } = mousePos
    const { x: pointX, y: pointY } = pointPos
    /**
     * # is mousePos
     * see if PointPos is landed in the zone below
     *
     * A -------- B
     * |          |
     * |          |
     *      #
     * |          |
     * |          |
     * C -------- D
     */
    const a = {
      x: mouseX - zoneLength,
      y: mouseY - zoneLength
    }
    const b = {
      x: mouseX + zoneLength,
      y: mouseY - zoneLength
    }
    const c = {
      x: mouseX - zoneLength,
      y: mouseY + zoneLength
    }
    return (a.x <= pointX) && (pointX <= b.x) &&
      (a.y <= pointY) && (pointY <= c.y)
  }

  getContentWidth() {
    return this.width - (this.xPadding * 2) - this.yLabelMargin - this.yLabelWidth
  }

  getContentHeight() {
    return this.height - (this.yPadding * 2) - this.xLabelMargin -
      this.xLabelHeight - this.getLineLabelBoxHeight()
  }

  getUniqSortedPoints(axis) {
    const points = uniqBy(this.pointsArr.flat(), axis)
    return sortBy(points, [axis])
  }

  getLengthTotalData(gap, gutter, values, measureLength, toLabel) {

    const valueCount = values.length
    const marked = {}

    // mark the first and last
    marked[0] = true
    marked[valueCount - 1] = true

    // Check whether a value can be marked next
    // For example, gap is 2
    //
    // values: 1 2 3 4 5 6 7
    // marked: v           v
    //
    // 4 will only be marked because it has enough gap on left and right side.
    const hasGap = index => {
      return range(index - gap, index).every(i => isUndef(marked[i])) &&
        range(index + 1, index + gap + 1).every(i => isUndef(marked[i]))
    }

    return values.reduce((res, value, i) => {

      if (i === 0) {
        const label = toLabel(value)
        const length = measureLength(label)
        const lengthTotal = res.lengthTotal + length + gutter
        const rows = res.rows.slice()
        rows.push({ label, length, value })
        return { lengthTotal, rows }
      }
      if (i === (valueCount - 1)) {
        const label = toLabel(value)
        const length = measureLength(label)
        const lengthTotal = res.lengthTotal + length
        const rows = res.rows.slice()
        rows.push({ label, length, value })
        return { lengthTotal, rows }
      }
      if (hasGap(i)) {
        const label = toLabel(value)
        marked[i] = true
        const length = measureLength(label)
        const lengthTotal = res.lengthTotal + length + gutter
        const rows = res.rows.slice()
        rows.push({ label, length, value })
        return { lengthTotal, rows }
      }
      return res
    }, {
      lengthTotal: 0,
      rows: []
    })
  }

  getLabelRows(options = {}) {

    const axis = options.axis || 'x'
    const gutter = options.gutter || this.xGutter
    const contentLength = options.contentLength || this.getContentWidth()
    const toLabel = options.toLabel || this.toXLabel
    const measureLength = options.measureLength || (v => this.ctx.measureText(v).width)

    const points = this.getUniqSortedPoints(axis)
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]

    if (points.length <= 2) {
      return points.map(p => {
        const value = p[axis]
        const label = toLabel(value)
        const length = measureLength(label)
        return { label, length, value }
      })
    }

    let step = options.step

    if (isUndef(step)) {
      step = parseInt((lastPoint[axis] - firstPoint[axis]) / (points.length - 1), 10)
    }

    const stepStart = parseInt(firstPoint[axis] / step, 10) * step
    let stepEnd = parseInt(lastPoint[axis] / step, 10) * step

    if (stepEnd < lastPoint[axis]) {
      stepEnd += step
    }

    const values = range(stepStart, stepEnd + step, step)

    const valueCount = values.length
    const initialGap = parseInt((valueCount - 2) / 2, 10)

    const firstValue = values[0]
    const lastValue = values[valueCount - 1]
    const firstLabel = toLabel(firstValue)
    const lastLabel = toLabel(lastValue)

    let stepRows = [
      { label: firstLabel, length: measureLength(firstLabel), value: firstValue },
      { label: lastLabel, length: measureLength(lastLabel), value: lastValue },
    ]

    for (let gap = initialGap; gap >= 0; gap--) {
      const { lengthTotal, rows } = this.getLengthTotalData(gap, gutter, values, measureLength, toLabel)
      if (lengthTotal <= contentLength) {
        stepRows = rows
        continue
      }
      return stepRows
    }
    return stepRows
  }

  getGutter(rows, contentLength) {
    const labelLength = rows.reduce((w, row) => w + row.length, 0)
    return parseInt((contentLength - labelLength) / (rows.length - 1), 10)
  }

  getLineLabelHeight() {
    return this.fontSize
  }

  getLineLabelBoxHeight() {
    if (this.lineLabels.length > 0) {
      return this.lineLabelMargin + this.getLineLabelHeight()
    }
    return 0
  }

  raf(fn) {
    if (isDef(window.requestAnimationFrame)) {
      return window.requestAnimationFrame(fn)
    }
    return fn()
  }

  refresh() {
    this.raf(() => {
      this.setCanvasSize()
      this.layers.forEach(layer => this.setCanvasSize(layer.canvas))
      this.setLabelWidths()
      this.setLabelHeights()
      this.setAxisData()
      this.setPointsPos()
      this.draw()
    })
  }

  removeAllLayers() {
    const { dom } = this
    this.layers.forEach(layer => {
      const { canvas } = layer
      if (dom.contains(canvas)) {
        dom.removeChild(canvas)
      }
    })
  }

  setCanvas() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    this.canvas = canvas
    this.ctx = ctx
    this.setFontSize()
    this.setCanvasSize()

    this.dom.appendChild(canvas)
  }

  setCanvasSize(canvas = this.canvas) {
    if (isUndef(this.options.width)) {
      this.width = this.dom.offsetWidth
    }
    const { dpr, width, height } = this

    // https://coderwall.com/p/vmkk6a/how-to-make-the-canvas-not-look-like-crap-on-retina
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = toPixel(width)
    canvas.style.height = toPixel(height)
    canvas.getContext('2d').scale(dpr, dpr)
  }

  setDpr() {
    this.dpr = window.devicePixelRatio || 1
  }

  setFontSize() {
    const { ctx } = this
    const args = ctx.font.split(' ')
    ctx.font = this.fontSize + 'px ' + args[args.length - 1]
  }

  setLabelHeights() {
    if (isUndef(this.xLabelHeight)) {
      this.xLabelHeight = this.fontSize
    }
    if (isUndef(this.yLabelHeight)) {
      this.yLabelHeight = this.fontSize
    }
  }

  setLabelWidths() {

    if (isDef(this.xLabelWidth) && isDef(this.yLabelWidth)) {
      return
    }

    const { toXLabel, toYLabel, ctx } = this
    const res = this.pointsArr.flat()
      .filter(p => p)
      .reduce((o, p) => {

        const { xLabelWidth, yLabelWidth } = o
        const measuredXLabelWidth = ctx.measureText(toXLabel(p.x)).width
        const measuredYLabelWidth = ctx.measureText(toYLabel(p.y)).width

        return {
          xLabelWidth: (measuredXLabelWidth > xLabelWidth) ? measuredXLabelWidth : xLabelWidth,
          yLabelWidth: (measuredYLabelWidth > yLabelWidth) ? measuredYLabelWidth : yLabelWidth,
        }
      }, {
        xLabelWidth: 0,
        yLabelWidth: 0
      })

    if (isUndef(this.xLabelWidth)) {
      this.xLabelWidth = res.xLabelWidth
    }
    if (isUndef(this.yLabelWidth)) {
      this.yLabelWidth = res.yLabelWidth
    }
  }

  setAxisData() {
    this.xLabelRows = this.getLabelRows({ step: this.xStep })
    this.yLabelRows = this.getLabelRows({
      axis: 'y',
      step: this.yStep,
      gutter: this.yGutter,
      contentLength: this.getContentHeight(),
      toLabel: this.toYLabel,
      measureLength: () => this.yLabelHeight
    })
  }

  setPoints(pointsArr) {
    this.pointsArr = pointsArr
    this.setLabelWidths()
    this.setLabelHeights()
    this.setAxisData()
    this.setPointsPos()
    this.raf(() => this.draw())
  }

  getLineWidth() {
    return this.getContentWidth()
  }

  getLineHeight() {
    return this.getContentHeight()
  }

  setPointsPos() {
    const { xLabelWidth, xLabelRows, yLabelRows, yLabelHeight } = this

    const halfXLabelWidth = (xLabelWidth / 2)
    const firstX = xLabelRows[0].value
    const lastX = xLabelRows[xLabelRows.length - 1].value
    const xDelta = lastX - firstX
    const xRatio = xDelta / this.getLineWidth()

    const yAxisStart = this.getYAxisStart()
    const yAxisEnd = this.getYAxisEnd()

    const lineHeight = Math.abs(yAxisStart - yAxisEnd)
    const firstY = yLabelRows[0].value
    const lastY = yLabelRows[yLabelRows.length - 1].value
    const yDelta = Math.abs(lastY - firstY)
    const yRatio = yDelta / lineHeight
    const halfYLabelHeight = (yLabelHeight / 2)


    this.pointsArr.forEach((points, i) => {
      points.forEach(p => {

        const posX = (p.x - firstX) / xRatio + halfXLabelWidth
        const posY = yAxisStart - ((p.y - firstY) / yRatio)

        p._pos = {
          x: posX,
          y: posY
        }
      })
    })
  }

  unbindMedia() {
    this.media.removeListener(this._handleDprChange)
  }

  destroy() {
    const { dom } = this
    const { toXLabel, toYLabel } = this.options
    if (isDef(toXLabel)) {
      mem.clear(this.toXLabel)
    }
    if (isDef(toYLabel)) {
      mem.clear(this.toYLabel)
    }
    this.removeAllLayers()
    if (dom.contains(this.canvas)) {
      dom.removeChild(this.canvas)
      dom.style.removeProperty('position')
    }
  }
}
