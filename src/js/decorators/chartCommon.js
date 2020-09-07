import isUndef from '../utils/isUndef'
import { toPixel } from '../utils'

export default function chartCommon(target) {

  return class extends target {

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

    removeAllLayers() {
      const { dom } = this
      this.layers.forEach(layer => {
        const { canvas } = layer
        if (dom.contains(canvas)) {
          dom.removeChild(canvas)
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

    setDomWidthIfNeeded() {
      if (isUndef(this.options.width)) {
        this.width = this.dom.offsetWidth
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
