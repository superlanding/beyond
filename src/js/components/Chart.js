import supportDom from '../utils/supportDom'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'

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

    this.xLabelGutter = options.xLabelGutter || 80
    this.yLabelGutter = options.yLabelGutter || 10

    this.init()
  }

  init() {
    this.setCanvas()
    this.clear()
  }

  setCanvas() {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.fontSize = this.getFontSize()
    this.dom.appendChild(canvas)
  }

  getFontSize() {
    return parseInt(this.ctx.font.split(' ')[0], 10) || 10
  }

  setXLabelCount() {
  }

  setYLabelCount() {
  }

  setPoints(pointsArr) {
    this.pointsArr = pointsArr
    this.setLabelWidths()
    this.setXLabelCount()
    this.setYLabelCount()
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
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0, 0, this.width, this.height)
  }
}
