import supportDom from '../utils/supportDom'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'
import { uniqBy, sortBy, range } from '../utils'

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
export default class Chart {

  constructor(dom, options = {}) {
    this.dom = dom
    this.pointsArr = []
    this.height = options.height || 150
    this.width = options.width || dom.offsetWidth
    this.xLabel = options.xLabel || (v => v)
    this.yLabel = options.yLabel || (v => v)

    this.xPadding = options.xPadding || 20
    this.yPadding = options.yPadding || 20

    this.xLabelWidth = options.xLabelWidth
    this.yLabelWidth = options.yLabelWidth

    this.xLabelGutter = options.xLabelGutter || 10
    this.yLabelGutter = options.yLabelGutter || 10

    this.xLabelMargin = options.xLabelMargin || 10
    this.yLabelMargin = options.yLabelMargin || 10

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
    canvas.width = this.width * dpr
    canvas.height = this.height * dpr

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
    return this.height - (this.yPadding * 2)
  }

  getSortedPointsByXAxis() {
    const points = uniqBy(this.pointsArr.flat(), 'x')
    return sortBy(points, ['x'])
  }

  getWidthDataByGap(gap, labels) {
    const { ctx, xLabelGutter } = this
    const length = labels.length
    const marked = {}

    // mark the first and last
    marked[0] = true
    marked[labels.length - 1] = true

    return labels.reduce((res, label, i) => {

      if (i === 0) {
        const width = ctx.measureText(label).width
        const rows = res.rows.slice()
        rows.push({ label, width })
        return {
          widthTotal: res.widthTotal + width + xLabelGutter,
          rows
        }
      }
      if (i === (length - 1)) {
        const width = ctx.measureText(label).width
        const rows = res.rows.slice()
        rows.push({ label, width })
        return {
          widthTotal: res.widthTotal + width,
          rows
        }
      }
      if (isUndef(marked[i - gap]) && isUndef(marked[i + gap])) {
        marked[i] = true
        const width = ctx.measureText(label).width
        const rows = res.rows.slice()
        rows.push({ label, width })
        return {
          widthTotal: res.widthTotal + ctx.measureText(label).width + xLabelGutter,
          rows
        }
      }
      return res
    }, {
      widthTotal: 0,
      rows: []
    })
  }

  getXLabelRows() {
    const { xStep, xLabel, ctx } = this
    const points = this.getSortedPointsByXAxis()
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    const stepStart = parseInt(firstPoint.x / xStep, 10) * xStep
    let stepEnd = parseInt(lastPoint.x / xStep, 10) * xStep

    if (stepEnd < lastPoint.x) {
      stepEnd += xStep
    }
    const xLabels = range(stepStart, stepEnd + xStep, xStep)
      .map(v => xLabel(v))

    if (xLabels.length <= 2) {
      return xLabels
    }

    const contentWidth = this.getContentWidth()
    const length = xLabels.length
    const initialGap = parseInt((length - 2) / 2, 10)
    const firstLabel = xLabels[0]
    const lastLabel = xLabels[xLabels.length - 1]
    let resRows = [
      { label: firstLabel, width: ctx.measureText(firstLabel).width },
      { label: lastLabel, width: ctx.measureText(lastLabel).width },
    ]

    for (let gap = initialGap; gap >= 0; gap--) {
      const { widthTotal, rows } = this.getWidthDataByGap(gap, xLabels)
      if (widthTotal <= contentWidth) {
        resRows = rows
        continue
      }
      return resRows
    }
    return resRows
  }

  drawXAxis() {
    const { ctx, xLabelGutter } = this
    let x = this.xPadding
    const contentWidth = this.getContentWidth()
    const y = this.height - this.yPadding - this.fontSize
    const rows = this.getXLabelRows()
    const labelWidth = rows.reduce((w, row) => w + row.width, 0)
    const gutter = parseInt((contentWidth - labelWidth) / (rows.length - 1), 10)

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#000'

    rows.forEach((row, i) => {
      const { label } = row
      ctx.fillText(label, x, y)
      x += gutter + row.width
    })
  }

  drawYAxis() {
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
}
