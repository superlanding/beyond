import supportDom from '../decorators/supportDom'
import chartCommon from '../decorators/chartCommon'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'
import { mem, range, sortBy, throttle, uniqBy } from '../utils'

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
@chartCommon
export default class LineChart {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
    this.pointsArr = []
    this.height = options.height
    this.width = options.width

    this.toXLabel = isDef(options.toXLabel) ? mem(options.toXLabel) : (v => v)
    this.toYLabel = isDef(options.toYLabel) ? mem(options.toYLabel) : (v => v)

    this.xPadding = isDef(options.xPadding) ? options.xPadding : 20
    this.yPadding = isDef(options.yPadding) ? options.yPadding : 20

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

    this.pointPosMap = new Map()
    this.xLabelRows = []
    this.yLabelRows = []

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

  get contentWidth() {
    return this.width - (this.xPadding * 2) - this.yLabelMargin -
      this.yLabelWidth - (this.xLabelWidth / 2)
  }

  get contentHeight() {
    return this.height - (this.yPadding * 2) - this.xLabelMargin -
      this.xLabelHeight - this.lineLabelBoxHeight
  }

  get firstX() {
    return this.xLabelRows[0].value
  }

  get lastX() {
    const { xLabelRows } = this
    return xLabelRows[xLabelRows.length - 1].value
  }

  get firstY() {
    return this.yLabelRows[0].value
  }

  get lastY() {
    const { yLabelRows } = this
    return yLabelRows[yLabelRows.length - 1].value
  }

  get lineLabelHeight() {
    return this.fontSize
  }

  get lineLabelBoxHeight() {
    if (this.lineLabels.length > 0) {
      return this.lineLabelMargin + this.lineLabelHeight
    }
    return 0
  }

  get xAxisStart() {
    return this.xPadding + (this.xLabelWidth / 2)
  }

  get xAxisEnd() {
    return this.xAxisStart + this.contentWidth
  }

  get xRatio() {
    const lineWidth = this.xAxisEnd - this.xAxisStart
    const xDelta = this.lastX - this.firstX
    return xDelta / lineWidth
  }

  get yAxisStart() {
    return this.height - this.yPadding - this.lineLabelBoxHeight -
      this.xLabelHeight - this.xLabelMargin + (this.yLabelHeight / 2)
  }

  get yAxisEnd() {
    return this.yAxisStart - this.contentHeight
  }

  get yRatio() {
    const lineHeight = this.yAxisStart - this.yAxisEnd
    const yDelta = Math.abs(this.lastY - this.firstY)
    return yDelta / lineHeight
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

  clearPointPos() {
    this.pointPosMap.clear()
  }

  draw() {
    this.clear()
    this.drawXAxis()
    this.drawYAxis()
    this.drawBgLines()
    this.drawLines()
    this.drawLineLables()
  }

  drawBgLines() {

    const { ctx, yLabelRows, contentWidth, firstY, xAxisStart, yAxisStart, yRatio } = this

    ctx.strokeStyle = 'rgba(224, 224, 224, .5)'
    ctx.lineWidth = 1

    yLabelRows.forEach(row => {

      const y = yAxisStart - ((row.value - firstY) / yRatio)

      ctx.beginPath()
      ctx.moveTo(xAxisStart, y)
      ctx.lineTo(xAxisStart + contentWidth, y)
      ctx.stroke()
      ctx.closePath
    })
  }

  drawLines() {
    const { ctx, pointPosMap, lineStyles } = this
    ctx.lineWidth = 2

    this.pointsArr.forEach((points, i) => {
      ctx.beginPath()
      ctx.strokeStyle = lineStyles[i] ? lineStyles[i] : '#000'
      points.forEach(p => {
        const pos = pointPosMap.get(p)
        ctx.lineTo(pos.x, pos.y)
      })
      ctx.stroke()
      ctx.closePath()
    })
  }

  drawLineLables() {
    const { ctx, lineStyles, lineLabelHeight } = this
    const rectSize = 7

    const rectGutter = 7
    const labelGutter = 14
    const rectMargin = 1
    const y = this.height - this.yPadding
    let x = this.xPadding

    this.lineLabels.forEach((name, i) => {
      ctx.fillStyle = lineStyles[i] || '#000'
      ctx.fillRect(x, y - lineLabelHeight + rectMargin, rectSize, rectSize)

      x += (rectSize + rectGutter)
      ctx.fillStyle = '#000'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(name, x, y - lineLabelHeight)
      x += (ctx.measureText(name).width + labelGutter)
    })
  }

  clearVerticalLine() {
    const { ctx } = this.firstLayer
    ctx.clearRect(0, 0, this.width, this.height)
  }

  drawVerticalLine(point, index) {
    const { ctx } = this.firstLayer
    const pos = this.pointPosMap.get(point)
    const style = this.lineStyles[index] || '#000'
    ctx.strokeStyle = style
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(pos.x, 0)
    ctx.lineTo(pos.x, this.height)
    ctx.stroke()
    ctx.closePath()

    this.fillCircle(ctx, pos.x, pos.y, 8, style, .2)
    this.fillCircle(ctx, pos.x, pos.y, 4, style)
  }

  drawXAxis() {
    const { ctx, firstX, xLabelRows, xAxisStart, xRatio } = this

    const y = this.height - this.yPadding - this.lineLabelBoxHeight

    const scaleMargin = 4
    const scaleSize = 4
    const scaleStart = y - scaleMargin - scaleSize
    const scaleEnd = y - scaleMargin

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#3c4257'
    ctx.textAlign = 'center'

    ctx.strokeStyle = '#3c4257'

    xLabelRows.forEach((row, i) => {

      const x = xAxisStart + ((row.value - firstX) / xRatio)

      ctx.beginPath()
      ctx.moveTo(x, scaleStart)
      ctx.lineTo(x, scaleEnd)
      ctx.stroke()
      ctx.closePath()

      ctx.fillText(row.label, x, y)
    })
  }

  drawYAxis() {
    const { ctx, firstY, yLabelRows, yAxisStart, yRatio } = this
    const x = this.width - this.xPadding
    const halfYLabelHeight = this.yLabelHeight / 2

    ctx.fillStyle = '#3c4257'
    ctx.textAlign = 'right'

    yLabelRows.forEach(row => {
      const y = yAxisStart - ((row.value - firstY) / yRatio)
      ctx.fillText(row.label, x, y - halfYLabelHeight)
    })
  }

  findClosetPoint(canvasMousePos) {
    const { pointsArr, pointPosMap } = this
    let index = 0
    for (const points of pointsArr) {
      for (const point of points) {
        const pos = pointPosMap.get(point)
        if (this.inDetectedZone(canvasMousePos, pos)) {
          return {
            index,
            point
          }
        }
      }
      index++
    }
  }

  handleDprChange() {
    this.setDpr()
    this.refresh()
  }

  handleMouseMove(event) {

    const canvasMousePos = this.getMousePosInCanvas(event)
    const res = this.findClosetPoint(canvasMousePos)

    this.raf(() => {
      this.clearVerticalLine()
      if (res) {
        this.drawVerticalLine(res.point, res.index)
      }
      // only fires if res differs
      if (this.lastClosetPointRes !== res) {
        const mousePos = this.getMousePos(canvasMousePos)
        this.options.onPointMouseOver(mousePos, res)
      }
      this.lastClosetPointRes = res
    })
  }

  inDetectedZone(canvasMousePos, pointPos) {
    const zoneLength = 14
    const { x: mouseX, y: mouseY } = canvasMousePos
    const { x: pointX, y: pointY } = pointPos
    /**
     * # is canvasMousePos
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

  getUniqSortedPoints(axis) {
    const points = uniqBy(this.pointsArr.flat(), axis)
    return sortBy(points, [axis])
  }

  getLabelRows(options = {}) {

    const axis = options.axis || 'x'
    const gutter = options.gutter || this.xGutter
    const contentLength = options.contentLength || this.contentWidth
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

    const firstPointValue = firstPoint[axis]
    const lastPointValue = lastPoint[axis]
    const pointLength = points.length

    let step = options.step

    if (isUndef(step)) {
      step = this.getAutoStep(firstPointValue, lastPointValue, pointLength)
    }

    const [stepStart, stepEnd] = this.getStepStartEnd(step, firstPointValue, lastPointValue)
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

  refresh() {
    this.raf(() => {
      this.clearPointPos()
      this.setDomSizeIfNeeded()
      this.setCanvasSize(this.canvas)
      this.layers.forEach(layer => this.setCanvasSize(layer.canvas))
      this.setLabelWidths()
      this.setLabelHeights()
      this.setAxisData()
      this.updateLabelSizeForAutoStep()
      this.setPointPos()
      this.draw()
    })
  }

  setLabelHeights() {
    this.xLabelHeight = this.fontSize
    this.yLabelHeight = this.fontSize
  }

  setLabelWidths() {

    const { toXLabel, toYLabel, ctx } = this
    const { xLabelWidth, yLabelWidth } = this.pointsArr.flat()
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

    this.xLabelWidth = xLabelWidth
    this.yLabelWidth = yLabelWidth
  }

  setAxisData() {
    this.xLabelRows = this.getLabelRows({ step: this.xStep })
    this.yLabelRows = this.getLabelRows({
      axis: 'y',
      step: this.yStep,
      gutter: this.yGutter,
      contentLength: this.contentHeight,
      toLabel: this.toYLabel,
      measureLength: () => this.yLabelHeight
    })
  }

  setData(pointsArr) {
    this.pointsArr = pointsArr
    this.clearPointPos()
    this.setLabelWidths()
    this.setLabelHeights()
    this.setAxisData()
    this.updateLabelSizeForAutoStep()
    this.setPointPos()
    this.raf(() => this.draw())
  }

  setPointPos() {
    const { firstX, firstY, pointPosMap, xAxisStart, xRatio, yAxisStart, yRatio } = this

    this.pointsArr.forEach((points, i) => {
      points.forEach(point => {
        const x = xAxisStart + ((point.x - firstX) / xRatio)
        const y = yAxisStart - ((point.y - firstY) / yRatio)
        const pos = { x, y }
        pointPosMap.set(point, pos)
      })
    })
  }

  updateLabelSizeForAutoStep() {
    const { measureWidth } = this
    if (isUndef(this.xStep)) {
      this.xLabelWidth = this.xLabelRows.reduce((width, row) => {
        const measuredWidth = row.length
        return (measuredWidth > width) ? measuredWidth : width
      }, 0)
    }
    if (isUndef(this.yStep)) {
      this.yLabelWidth = this.yLabelRows.reduce((width, row) => {
        const measuredWidth = measureWidth.call(this, row.label)
        return (measuredWidth > width) ? measuredWidth : width
      }, 0)
    }
  }

  destroy() {
    const { dom, canvas } = this
    const { toXLabel, toYLabel } = this.options

    if (isDef(toXLabel)) {
      mem.clear(this.toXLabel)
    }
    if (isDef(toYLabel)) {
      mem.clear(this.toYLabel)
    }
    this.clearPointPos()
    this.unbindMedia()
    this.removeAllLayers()

    if (dom.contains(canvas)) {
      dom.removeChild(canvas)
      dom.style.removeProperty('position')
    }
  }
}
