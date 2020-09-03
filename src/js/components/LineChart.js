import supportDom from '../utils/supportDom'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'
import { uniqBy, sortBy, range, toPixel } from '../utils'

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
 *                                                                          yLabelGutter            |
 *                                                                              v                   |
 *                ----------------------------------------------------------- yLabel                |
 *                xLabel <- xLabelGutter -> xLabel <- xLabelGutter ->  xLabel                       |
 *                                            ^                                                     |
 *                                            |                                                     |
 *                                         yPadding                                                 |
 *                                            |                                                     |
 *                                            v                                                     |
 * --------------------------------------------------------------------------------------------------
 **/

@supportDom
export default class LineChart {

  constructor(dom, options = {}) {
    this.dom = dom
    this.pointsArr = []
    this.height = options.height || 150
    this.width = options.width || dom.offsetWidth
    this.xLabel = options.xLabel || (v => v)
    this.yLabel = options.yLabel || (v => v)

    this.xPadding = isDef(options.xPadding) ? options.xPadding : 20
    this.yPadding = isDef(options.yPadding) ? options.yPadding : 20

    this.xLabelWidth = options.xLabelWidth
    this.yLabelWidth = options.yLabelWidth

    this.xLabelGutter = isDef(options.xLabelGutter) ? options.xLabelGutter : 10
    this.yLabelGutter = isDef(options.yLabelGutter) ? options.yLabelGutter : 10

    this.xLabelMargin = isDef(options.xLabelMargin) ? options.xLabelMargin : 10
    this.yLabelMargin = isDef(options.yLanelMargin) ? options.yLabelMargin : 10

    this.bgColor = options.bgColor || '#fff'
    this.fontSize = options.fontSize || 12

    this.xStep = options.xStep
    this.yStep = options.yStep

    this.init()
  }

  init() {
    this.setCanvas()
    this.clear()
  }

  setCanvas() {
    const dpr = window.devicePixelRatio || 1
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const { width, height } = this

    // https://coderwall.com/p/vmkk6a/how-to-make-the-canvas-not-look-like-crap-on-retina
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = toPixel(width)
    canvas.style.height = toPixel(height)
    ctx.scale(dpr, dpr)

    this.canvas = canvas
    this.ctx = ctx
    this.setFontSize()
    this.dom.appendChild(canvas)
  }

  setFontSize() {
    const { ctx } = this
    const args = ctx.font.split(' ')
    ctx.font = this.fontSize + 'px ' + args[args.length - 1]
  }

  getContentWidth() {
    return this.width - (this.xPadding * 2) - this.yLabelMargin - this.yLabelWidth
  }

  getContentHeight() {
    return this.height - (this.yPadding * 2) - this.xLabelMargin - this.fontSize
  }

  getUniqSortedPoints(axis) {
    const points = uniqBy(this.pointsArr.flat(), axis)
    return sortBy(points, [axis])
  }

  getLengthTotalData(gap, gutter, labels, measureLength) {

    const labelCount = labels.length
    const marked = {}

    // mark the first and last
    marked[0] = true
    marked[labelCount - 1] = true

    return labels.reduce((res, label, i) => {

      if (i === 0) {
        const length = measureLength(label)
        const lengthTotal = res.lengthTotal + length + gutter
        const rows = res.rows.slice()
        rows.push({ label, length })
        return { lengthTotal, rows }
      }
      if (i === (labelCount - 1)) {
        const length = measureLength(label)
        const lengthTotal = res.lengthTotal + length
        const rows = res.rows.slice()
        rows.push({ label, length })
        return { lengthTotal, rows }
      }
      if (isUndef(marked[i - gap]) && isUndef(marked[i + gap])) {
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
    const step = options.step || this.xStep
    const gutter = options.gutter || this.xLabelGutter
    const contentLength = options.contentLength || this.getContentWidth()
    const toLabel = options.toLabel || this.xLabel
    const measureLength = options.measureLength || (v => this.ctx.measureText(v).width)

    const { ctx } = this
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

    const stepStart = parseInt(firstPoint[axis] / step, 10) * step
    let stepEnd = parseInt(lastPoint[axis] / step, 10) * step

    if (stepEnd < lastPoint[axis]) {
      stepEnd += step
    }

    const labels = range(stepStart, stepEnd + step, step)
      .map(v => toLabel(v))

    const labelCount = labels.length
    const initialGap = parseInt((labelCount - 2) / 2, 10)

    const firstLabel = labels[0]
    const lastLabel = labels[labelCount - 1]

    let stepRows = [
      { label: firstLabel, length: measureLength(firstLabel) },
      { label: lastLabel, length: measureLength(lastLabel) },
    ]

    for (let gap = initialGap; gap >= 0; gap--) {
      const { lengthTotal, rows } = this.getLengthTotalData(gap, gutter, labels, measureLength)
      if (lengthTotal <= contentLength) {
        stepRows = rows
        continue
      }
      return stepRows
    }
    return stepRows
  }

  drawXAxis() {
    const { ctx } = this
    const contentWidth = this.getContentWidth()
    const rows = this.getLabelRows()
    const labelWidth = rows.reduce((w, row) => w + row.length, 0)
    const gutter = parseInt((contentWidth - labelWidth) / (rows.length - 1), 10)

    let x = this.xPadding
    const y = this.height - this.yPadding - this.fontSize

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#3c4257'

    rows.forEach((row, i) => {
      ctx.fillText(row.label, x, y)
      x += gutter + row.length
    })
  }

  drawYAxis() {
    const { ctx } = this
    const contentHeight = this.getContentHeight()
    const rows = this.getLabelRows({
      axis: 'y',
      step: this.yStep,
      gutter: this.yLabelGutter,
      contentLength: contentHeight,
      toLabel: this.yLabel,
      measureLength: () => this.fontSize
    })
    const labelHeight = rows.reduce((w, row) => w + row.length, 0)
    const gutter = parseInt((contentHeight - labelHeight) / (rows.length - 1), 10)

    const x = this.width - this.xPadding
    let y = this.height - this.yPadding - this.fontSize - this.xLabelMargin - this.fontSize

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#3c4257'
    ctx.textAlign = 'right'

    rows.forEach(row => {
      ctx.fillText(row.label, x, y)
      y -= (gutter + row.length)
    })
    this.drawLines(rows, gutter)
  }

  drawLines(rows, gutter) {
    const { ctx } = this
    const contentWidth = this.getContentWidth()
    const x = this.xPadding
    let y = this.height - this.yPadding - this.fontSize - this.xLabelMargin - (this.fontSize / 2)

    ctx.strokeStyle = 'rgba(224, 224, 224, .5)'

    rows.forEach(row => {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + contentWidth, y)
      ctx.stroke()
      ctx.closePath
      y -= (gutter + row.length)
    })
  }

  setPoints(pointsArr) {
    this.pointsArr = pointsArr
    this.setLabelWidths()
    this.drawXAxis()
    this.drawYAxis()
    this.drawPoints()
  }

  setLabelWidths() {

    if (isDef(this.xLabelWidth) && isDef(this.yLabelWidth)) {
      return
    }

    const { xLabel, yLabel, ctx } = this
    const { round } = Math
    const res = this.pointsArr.map(points => points[points.length - 1])
      .filter(p => p)
      .reduce((o, p) => {

        const { xLabelWidth, yLabelWidth } = o

        const xLabelSize = ctx.measureText(xLabel(p.x))
        const yLabelSize = ctx.measureText(yLabel(p.y))

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

  drawPoints() {
    this.pointsArr.forEach(points => {
    })
  }

  clear() {
    this.ctx.fillStyle = this.bgColor
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  destroy() {
    if (this.dom.contains(this.canvas)) {
      this.dom.removeChild(this.canvas)
    }
  }
}
