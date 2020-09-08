import supportDom from '../decorators/supportDom'
import chartCommon from '../decorators/chartCommon'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'
import isInt from '../utils/isInt'
import { mem, range, sortBy, throttle, uniqBy } from '../utils'

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
    this.barPos = new Map()

    this.init()
  }

  init() {
    this.setDpr()
    this.setDomWidthIfNeeded()
    this.setCanvas()
    this.clear()
    this.bindMedia()
    this.bindBarVisible()
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

  bindBarVisible() {
    if (isUndef(this.options.onBarVisible)) {
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
    this.drawXAxis()
    this.drawYAxis()
    this.drawBgLines()
    this.drawBars()
  }

  drawBars() {
    const { barPos, barStyles, ctx, xLabelRows } = this
    xLabelRows.forEach((row, i) => {
      const pos = barPos.get(row)
      if (pos) {
        const { x, y, width, height } = pos
        ctx.fillStyle = barStyles[i] || '#000'
        ctx.fillRect(x, y, width, height)
      }
    })
  }

  drawBgLines() {

    const { ctx, yLabelRows, firstY, yAxisStart, yRatio } = this
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

  findMouseOverBarPos(mousePos) {
    const { barPos, xLabelRows } = this
    const { x: mouseX, y: mouseY } = mousePos
    let index = 0
    for (const row of xLabelRows) {
      const pos = barPos.get(row)
      const { x, y, width, height } = pos
      if ((x <= mouseX) && (mouseX <= (x + width)) &&
        (y <= mouseY) && (mouseY <= (y + height))) {
        return { index, row, pos }
      }
      ++index
    }
  }

  drawBarGlow(res) {
    this.clearBarGlow()
    const ctx = this.firstLayer.canvas.getContext('2d')
    ctx.save()
    const { x, y, width, height } = res.pos
    const glowWidth = width * 1.4
    const glowHeight = ((glowWidth - width) / 2) + height
    const glowX = x - ((glowWidth - width) / 2)
    const glowY = y - (glowHeight - height)
    ctx.globalAlpha = 0.2
    ctx.fillStyle = this.barStyles[res.index]
    ctx.fillRect(glowX, glowY, glowWidth, glowHeight)
    ctx.restore()
  }

  clearBarGlow() {
    const ctx = this.firstLayer.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.width, this.height)
  }

  handleMouseMove(event) {
    const mousePos = this.getMousePos(event)
    const res = this.findMouseOverBarPos(mousePos)
    const { lastMouseOverRes } = this

    // don't repaint the same index
    if (lastMouseOverRes && res && (lastMouseOverRes.index === res.index)) {
      return
    }

    // don't re-clear
    if (isUndef(res) && isUndef(lastMouseOverRes)) {
      return
    }

    if (res) {
      this.drawBarGlow(res)
    }
    else {
      this.clearBarGlow()
    }
    this.options.onBarVisible(event, mousePos, res)
    this.lastMouseOverRes = res
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

    const { contentHeight } = this
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
    this.raf(() => {
      this.setDomWidthIfNeeded()
      this.setCanvasSize(this.canvas)
      this.setLabelWidths()
      this.setLabelHeights()
      this.setAxisData()
      this.setBarPos()
      this.draw()
    })
  }

  setAxisData() {
    this.xLabelRows = this.getXLabelRows()
    this.yLabelRows = this.getYLabelRows()
  }

  setBarPos() {
    const barWidth = 45
    const halfBarWidth = parseInt(barWidth / 2, 10)
    const { barPos, firstY, xLabelRows, xAxisStart, xAxisEnd, yAxisStart, yRatio } = this
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
      const barHeight = (row.value - firstY) / yRatio
      const centerPoint = centerPoints[i]
      const x = centerPoint - halfBarWidth
      const y = yAxisStart - barHeight
      const pos = { x, y, width: barWidth, height: barHeight }
      barPos.set(row, pos)
    })
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
    this.setDpr()
    this.refresh()
  }

  destroy() {
    const { dom, canvas } = this
    const { toYLabel } = this.options

    if (isDef(toYLabel)) {
      mem.clear(this.toYLabel)
    }
    this.unbindMedia()
    this.removeAllLayers()

    if (dom.contains(canvas)) {
      dom.removeChild(canvas)
      dom.style.removeProperty('position')
    }
  }
}
