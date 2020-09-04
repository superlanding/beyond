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
    this.yPadding = isDef(options.yPadding) ? options.yPadding : 16

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
    this.lineLabelMargin = isDef(options.lineLabelMargin) ? options.lineLabelMargin : 14
    this.layers = []

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
    this.addEvent(this.canvas, 'mousemove', throttle(this.handleMouseMove.bind(this), 30))
  }

  clear() {
    this.ctx.fillStyle = this.bgColor
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  draw() {
    this.clear()
    const contentWidth = this.getContentWidth()
    const xLabelRows = this.getLabelRows({ step: this.xStep })
    const xGutter = this.getGutter(xLabelRows, contentWidth)

    this.drawXAxis(xLabelRows, xGutter)

    const contentHeight = this.getContentHeight()
    const yLabelRows = this.getLabelRows({
      axis: 'y',
      step: this.yStep,
      gutter: this.yGutter,
      contentLength: contentHeight,
      toLabel: this.toYLabel,
      measureLength: () => this.yLabelHeight
    })
    const yGutter = this.getGutter(yLabelRows, contentHeight)

    this.drawYAxis(yLabelRows, yGutter)
    this.drawBgLines(yLabelRows, yGutter)

    this.drawLines()
    this.drawLineLables()
  }

  drawBgLines(rows, gutter) {
    const { ctx } = this
    const contentWidth = this.getContentWidth()
    const x = this.xPadding
    let y = this.height - this.yPadding - this.fontSize -
      this.xLabelMargin - (this.fontSize / 2) - this.getLineLabelBoxHeight()

    ctx.strokeStyle = 'rgba(224, 224, 224, .5)'
    ctx.lineWidth = 1

    rows.forEach(row => {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + contentWidth, y)
      ctx.stroke()
      ctx.closePath
      y -= (gutter + row.length)
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

  drawVerticalLine(point, index) {
    const { ctx } = this
    const pos = point._pos
    ctx.strokeStyle = this.lineStyles[index] || '#000'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(pos.x, 0)
    ctx.lineTo(pos.x, this.height)
    ctx.stroke()
    ctx.closePath()
  }

  drawXAxis(rows, gutter) {
    const { ctx } = this

    let x = this.xPadding
    const y = this.height - this.yPadding - this.fontSize - this.getLineLabelBoxHeight()

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#3c4257'

    rows.forEach((row, i) => {
      ctx.fillText(row.label, x, y)
      x += gutter + row.length
    })
  }

  drawYAxis(rows, gutter) {
    const { ctx } = this
    const x = this.width - this.xPadding
    let y = this.height - this.yPadding - this.fontSize -
      this.xLabelMargin - this.fontSize - this.getLineLabelBoxHeight()

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#3c4257'
    ctx.textAlign = 'right'

    rows.forEach(row => {
      ctx.fillText(row.label, x, y)
      y -= (gutter + row.length)
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
    if (res) {
      const { point, index } = res
      this.raf(() => {
        this.draw()
        this.drawVerticalLine(point, index)
      })
    }
    else {
      this.raf(() => this.draw())
    }
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
        rows.push({ label, length })
        return { lengthTotal, rows }
      }
      if (i === (valueCount - 1)) {
        const label = toLabel(value)
        const length = measureLength(label)
        const lengthTotal = res.lengthTotal + length
        const rows = res.rows.slice()
        rows.push({ label, length })
        return { lengthTotal, rows }
      }
      if (hasGap(i)) {
        const label = toLabel(value)
        marked[i] = true
        const length = measureLength(label)
        const lengthTotal = res.lengthTotal + length + gutter
        const rows = res.rows.slice()
        rows.push({ label, length })
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
        const label = toLabel(p[axis])
        const length = measureLength(label)
        return { label, length }
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

    const firstLabel = toLabel(values[0])
    const lastLabel = toLabel(values[valueCount - 1])

    let stepRows = [
      { label: firstLabel, length: measureLength(firstLabel) },
      { label: lastLabel, length: measureLength(lastLabel) },
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
    const { round } = Math
    const res = this.pointsArr.map(points => points[points.length - 1])
      .filter(p => p)
      .reduce((o, p) => {

        const { xLabelWidth, yLabelWidth } = o

        const xLabelSize = ctx.measureText(toXLabel(p.x))
        const yLabelSize = ctx.measureText(toYLabel(p.y))

        const measuredXLabelWidth = round(xLabelSize.width)
        const measuredYLabelWidth = round(yLabelSize.width)

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

  setPoints(pointsArr) {
    this.pointsArr = pointsArr
    this.setLabelWidths()
    this.setLabelHeights()
    this.setPointsPos()
    this.raf(() => this.draw())
  }

  setPointsPos() {
    const { xPadding, yPadding, xLabelWidth,
      xLabelHeight, yLabelHeight, xLabelMargin } = this

    const halfXlabelWidth = parseInt(xLabelWidth / 2, 10)
    const halfYlabelHeight = parseInt(yLabelHeight / 2, 10)

    const contentWidth = this.getContentWidth() - xLabelWidth
    const xPoints = this.getUniqSortedPoints('x')
    const firstX = xPoints[0].x
    const lastX = xPoints[xPoints.length - 1].x
    const xDelta = lastX - firstX

    const contentHeight = this.getContentHeight() - yLabelHeight
    const yPoints = this.getUniqSortedPoints('y')
    const firstY = yPoints[0].y
    const lastY = yPoints[yPoints.length - 1].y
    const yDelta = lastY - firstY
    const canvasHeight = this.height

    const labelBoxHeight = this.getLineLabelBoxHeight()

    this.pointsArr.forEach((points, i) => {
      points.forEach(p => {
        const xRatio = (p.x - firstX) / xDelta
        const x = contentWidth * xRatio

        const yRatio = (p.y - firstY) / yDelta
        const y = contentHeight * yRatio
        const posX = x + xPadding + halfXlabelWidth
        const posY = canvasHeight - yPadding - xLabelHeight -
          xLabelMargin - halfYlabelHeight - y - labelBoxHeight
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
