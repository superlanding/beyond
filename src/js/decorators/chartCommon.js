import raf from '../utils/raf'
import isUndef from '../utils/isUndef'
import isFn from '../utils/isFn'
import { getDomPos, range, toPixel, isFunction } from '../utils'
import { DEFAULT_CHART_STYLES } from '../consts'

export default function chartCommon(target) {

  return class extends target {

    constructor(...args) {
      super(...args)
      this.raf = raf
    }

    init() {
      this.offLabels = []
      this.layers = []
      if (isFunction(super.init)) {
        super.init()
      }
    }

    get firstLayer() {
      return this.layers[0]
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

    clear() {
      const { ctx } = this
      ctx.fillStyle = this.bg
      ctx.fillRect(0, 0, this.width, this.height)
    }

    getHypotenuse(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2))
    }

    fillCircle(ctx, x, y, radius, style, alpha) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = style
      ctx.globalAlpha = alpha || 1
      ctx.fill()
      ctx.closePath()
      ctx.restore()
    }

    fillArc(ctx, x, y, radius, startAngle = 0, endAngle = 2 * Math.PI, options = {}) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, radius, startAngle, endAngle)
      ctx.fillStyle = options.style || '#555'
      ctx.globalAlpha = options.alpha || 1
      ctx.lineTo(x, y)
      ctx.fill()
      ctx.closePath()
      ctx.restore()
    }

    getAutoStep(firstValue, lastValue, pointsLength) {
      return (lastValue - firstValue) / (pointsLength - 1)
    }

    getHighestCanvas() {
      const { layers, canvas } = this
      if (layers.length === 0) {
        return canvas
      }
      return layers[layers.length - 1].canvas
    }

    // real position in window including scrolling distance
    getMousePos(canvasMousePos) {
      const domPos = getDomPos(this.dom)
      return {
        x: domPos.x + canvasMousePos.x,
        y: domPos.y + canvasMousePos.y
      }
    }

    getMousePosInCanvas(event) {
      const rect = this.canvas.getBoundingClientRect()
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
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

    getStepStartEnd(step, firstValue, lastValue) {

      const stepStart = parseInt(firstValue / step, 10) * step
      let stepEnd = parseInt(lastValue / step, 10) * step

      if (stepEnd < lastValue) {
        stepEnd += step
      }
      return [stepStart, stepEnd]
    }

    measureWidth(value) {
      return this.ctx.measureText(value).width
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
      this.setCanvasFontSize(this.canvas, this.fontSize)
      this.setCanvasSize(canvas)

      this.dom.appendChild(canvas)
    }

    setLabelBox() {
      const box = document.createElement('div')
      box.className = 'chart-box'
      this.labelBox = box
      this.dom.appendChild(box)
    }

    drawLabels(labels, styles = DEFAULT_CHART_STYLES) {
      const { labelBox, handleLabelMouseOver, handleLabelMouseLeave } = this
      this.dom.style.backgroundColor = this.bg

      this.offLabels.forEach(off => off())
      labelBox.innerHTML = ''

      this.offLabels.length = 0

      labels.forEach((label, i) => {

        const div = document.createElement('div')
        div.className = 'chart-box-item'

        const square = document.createElement('div')
        square.className = 'chart-box-square'
        square.style.backgroundColor = styles[i]
        div.appendChild(square)

        const span = document.createElement('span')
        span.textContent = label
        div.appendChild(span)

        labelBox.appendChild(div)

        if (isFn(handleLabelMouseOver)) {
          const off = this.addEvent(div, 'mouseover', () => this.handleLabelMouseOver(i))
          this.offLabels.push(off)
        }
        if (isFn(handleLabelMouseLeave)) {
          const off = this.addEvent(div, 'mouseleave', () => this.handleLabelMouseLeave(i))
          this.offLabels.push(off)
        }
      })
    }

    setCanvasFontSize(canvas, fontSize) {
      const ctx = canvas.getContext('2d')
      const args = ctx.font.split(' ')
      ctx.font = fontSize + 'px ' + args[args.length - 1]
    }

    setCanvasSize(canvas) {
      const { dpr, width, height } = this

      // https://coderwall.com/p/vmkk6a/how-to-make-the-canvas-not-look-like-crap-on-retina
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = toPixel(width)
      canvas.style.height = toPixel(height)
      canvas.getContext('2d').scale(dpr, dpr)
    }

    clearCanvasSize(canvas) {
      canvas.width = 0
      canvas.height = 0
      canvas.style.width = 0
      canvas.style.height = 0
    }

    setDomSizeIfNeeded() {
      if (isUndef(this.options.width)) {
        this.width = this.dom.offsetWidth
      }
      if (isUndef(this.options.height)) {
        this.height = this.dom.offsetHeight
      }
    }

    setDpr() {
      this.dpr = window.devicePixelRatio || 1
    }

    unbindMedia() {
      this.media.removeListener(this._handleDprChange)
    }
  }
}
