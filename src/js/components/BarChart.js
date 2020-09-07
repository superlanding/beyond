import supportDom from '../decorators/supportDom'
import chartCommon from '../decorators/chartCommon'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'
import isInt from '../utils/isInt'
import { mem, range, sortBy, uniqBy } from '../utils'

const defaultBarStyles = [
  '#5469d4',
  '#7c54d4',
  '#a254d4'
]

@supportDom
@chartCommon
export default class BarChart {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
    this.bars = []

    this.height = options.height || 186
    this.width = options.width

    this.toYLabel = isDef(options.toYLabel) ? mem(options.toYLabel) : (v => v)

    this.xPadding = isDef(options.xPadding) ? options.xPadding : 20
    this.yPadding = isDef(options.yPadding) ? options.yPadding : 20

    this.yStep = options.yStep
    this.yGutter = isDef(options.yGutter) ? options.yGutter : 10

    this.xLabelMargin = isDef(options.xLabelMargin) ? options.xLabelMargin : 10
    this.yLabelMargin = isDef(options.yLanelMargin) ? options.yLabelMargin : 14

    this.fontSize = options.fontSize || 12
    this.bgColor = options.bgColor || '#fff'
    this.barStyles = options.barStyles || defaultBarStyles

    this.yLabelRows = []

    this.init()
  }

  init() {
    this.setDpr()
    this.setDomWidthIfNeeded()
    this.setCanvas()
    this.clear()
    this.bindMedia()
  }

  get contentWidth() {
    return this.width - (this.xPadding * 2) - this.yLabelMargin -
      this.yLabelWidth - this.halfXLabelWidth
  }

  get contentHeight() {
    return this.height - (this.yPadding * 2) - this.xLabelMargin - this.xLabelHeight
  }

  get firstY() {
    return this.yLabelRows[0].value
  }

  get halfXLabelWidth() {
    return this.xLabelWidth / 2
  }

  get halfYLabelHeight() {
    return this.yLabelHeight / 2
  }

  get xAxisStart() {
    return this.xPadding + this.halfXLabelWidth
  }

  get xAxisEnd() {
    return this.width - this.xPadding - this.yLabelWidth -
      this.yLabelMargin - this.halfXLabelWidth
  }

  get yAxisStart() {
    return this.height - this.yPadding - this.xLabelHeight -
      this.xLabelMargin + this.halfYLabelHeight
  }

  get yAxisEnd() {
    return this.yAxisStart - this.contentHeight
  }

  get lastY() {
    const { yLabelRows } = this
    return yLabelRows[yLabelRows.length - 1].value
  }

  get yRatio() {
    const lineHeight = this.yAxisStart - this.yAxisEnd
    const yDelta = Math.abs(this.lastY - this.firstY)
    return yDelta / lineHeight
  }

  draw() {
    this.clear()
    this.drawXAxis()
    this.drawYAxis()
    this.drawBgLines()
    this.drawBars()
  }

  drawBars() {
    const barWidth = 45
    const halfBarWidth = parseInt(barWidth / 2, 10)
    const { barStyles, ctx, firstY, xLabelRows, xAxisStart, xAxisEnd, yAxisStart, yRatio } = this
    const totalWidth = xLabelRows.reduce((w, row) => w + row.length, 0)
    const contentWidth = xAxisEnd - xAxisStart
    const gutter = (contentWidth - totalWidth) / (xLabelRows.length - 1)

    const { centerPoints } = xLabelRows.reduce((res, row, i) => {
      const { x } = res
      const centerPoints = res.centerPoints.slice()
      const width = row.length
      const halfWidth = parseInt(width / 2, 10)
      centerPoints.push(x + halfWidth)
      return {
        x: x + (width + gutter),
        centerPoints
      }
    }, {
      x: xAxisStart,
      centerPoints: []
    })

    xLabelRows.forEach((row, i) => {
      ctx.fillStyle = barStyles[i] || '#000'
      const barHeight = (row.value - firstY) / yRatio
      const centerPoint = centerPoints[i]
      const x = centerPoint - halfBarWidth
      const y = yAxisStart - barHeight
      ctx.fillRect(x, y, barWidth, barHeight)
    })
  }

  drawBgLines() {

    const { ctx, yLabelRows, contentWidth, firstY, yAxisStart, yRatio } = this
    const xStart = this.xPadding
    const xEnd = this.width - this.xPadding - this.yLabelWidth - this.yLabelMargin

    ctx.strokeStyle = 'rgba(224, 224, 224, .5)'
    ctx.lineWidth = 1

    yLabelRows.forEach(row => {

      const y = yAxisStart - ((row.value - firstY) / yRatio)

      ctx.beginPath()
      ctx.moveTo(xStart, y)
      ctx.lineTo(xEnd, y)
      ctx.stroke()
      ctx.closePath
    })
  }

  drawXAxis() {
    const { ctx, xLabelRows, xAxisStart, xAxisEnd } = this
    const totalWidth = xLabelRows.reduce((w, row) => w + row.length, 0)
    const contentWidth = xAxisEnd - xAxisStart
    const gutter = (contentWidth - totalWidth) / (xLabelRows.length - 1)
    const y = this.height - this.yPadding
    let x = xAxisStart

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#3c4257'

    xLabelRows.forEach((row, i) => {
      ctx.fillText(row.label, x, y)
      x += (row.length + gutter)
    })
  }

  drawYAxis() {
    const { ctx, firstY, yLabelRows, yAxisStart, yRatio, yLabelHeight } = this
    const x = this.width - this.xPadding
    const delta = yLabelHeight * .45

    ctx.fillStyle = '#3c4257'
    ctx.textAlign = 'right'

    yLabelRows.forEach(row => {
      const y = yAxisStart - ((row.value - firstY) / yRatio)
      ctx.fillText(row.label, x, y - delta)
    })
  }

  getUniqSortedBars() {
    const bars = uniqBy(this.bars, 'value')
    return sortBy(bars, ['value'])
  }

  getXLabelRows() {
    const { ctx } = this
    return this.bars.map(bar => {
      const label = bar.name
      return {
        label,
        length: ctx.measureText(label).width,
        value: bar.value
      }
    })
  }

  getYLabelRows() {

    const { contentHeight, ctx } = this
    const gutter = this.yGutter
    const toLabel = this.toYLabel
    const measureLength = () => this.fontSize

    const bars = this.getUniqSortedBars()
    const firstBar = bars[0]
    const lastBar = bars[bars.length - 1]

    if (bars.length <= 2) {
      return bars.map(bar => {
        const value = bar.value
        const label = toLabel(value)
        const length = measureLength()
        return { label, length, value }
      })
    }

    const firstBarValue = firstBar.value
    const lastBarValue = lastBar.value
    const barCount = bars.length

    let step = this.yStep

    if (isUndef(step)) {
      step = this.getAutoStep(firstBarValue, lastBarValue, barCount)
    }

    const [stepStart, stepEnd] = this.getStepStartEnd(step, firstBarValue, lastBarValue)
    const values = range(stepStart, stepEnd + step, step)
      .map(value => {
        return isInt(value) ? value : parseFloat(value.toFixed(2))
      })

    const valueCount = values.length
    const initialGap = parseInt((valueCount - 2) / 2, 10)

    const firstValue = values[0]
    const lastValue = values[valueCount - 1]
    const firstLabel = toLabel(firstValue)
    const lastLabel = toLabel(lastValue)

    let stepRows = [
      { label: firstLabel, length: measureLength(), value: firstValue },
      { label: lastLabel, length: measureLength(), value: lastValue },
    ]

    for (let gap = initialGap; gap >= 0; gap--) {
      const { lengthTotal, rows } = this.getLengthTotalData(gap, gutter, values, measureLength, toLabel)
      if (lengthTotal <= contentHeight) {
        stepRows = rows
        continue
      }
      return stepRows
    }
    return stepRows
  }

  refresh() {
  }

  setAxisData() {
  }

  setBarPos() {
  }

  setAxisData() {
    this.xLabelRows = this.getXLabelRows()
    this.yLabelRows = this.getYLabelRows()
  }

  setData(bars) {
    this.bars = bars
    this.setLabelWidths()
    this.setLabelHeights()
    this.setAxisData()
    this.setBarPos()
    this.raf(() => this.draw())
  }

  setLabelWidths() {

    const { toYLabel, ctx } = this
    const res = this.bars.filter(bar => bar)
      .reduce((o, bar) => {

        const { xLabelWidth, yLabelWidth } = o
        const measuredXLabelWidth = ctx.measureText(bar.name).width
        const measuredYLabelWidth = ctx.measureText(toYLabel(bar.value)).width

        return {
          xLabelWidth: (measuredXLabelWidth > xLabelWidth) ? measuredXLabelWidth : xLabelWidth,
          yLabelWidth: (measuredYLabelWidth > yLabelWidth) ? measuredYLabelWidth : yLabelWidth,
        }
      }, {
        xLabelWidth: 0,
        yLabelWidth: 0
      })

    this.xLabelWidth = res.xLabelWidth
    this.yLabelWidth = res.yLabelWidth
  }

  setLabelHeights() {
    this.xLabelHeight = this.fontSize
    this.yLabelHeight = this.fontSize
  }

  handleDprChange() {
  }
}
