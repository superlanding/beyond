import raf from '../utils/raf'
import supportDom from '../decorators/supportDom'

@supportDom
export default class TagInput {

  constructor(dom) {
    this.dom = dom
    this.defaultInputWidth = 128
    this.raf = raf
    this.init()
  }

  init() {
    this.setup()
    this.addEvents()
  }

  setup() {
    const input = document.createElement('input')
    input.type = 'text'
    input.style.width = this.defaultInputWidth + 'px'
    this.input = input
    this.canvas = document.createElement('canvas')
    this.dom.append(input)
  }

  getTextWidth(text, font) {
    const context = this.canvas.getContext('2d')
    context.font = font
    const metrics = context.measureText(text)
    return metrics.width
  }

  getNextInputWidth(textWidth) {
    const { defaultInputWidth } = this
    // spaces before text and after text
    const delta = 5
    const nextWidth = textWidth + delta
    if (nextWidth < defaultInputWidth) {
      return defaultInputWidth
    }
    return nextWidth
  }

  addEvents() {
    const { input } = this
    const font = window.getComputedStyle(input)
      .getPropertyValue('font')

    this.addEvent(input, 'input', () => {
      this.raf(() => {
        const textWidth = this.getTextWidth(input.value, font)
        const nextWidth = this.getNextInputWidth(textWidth)
        input.style.width = nextWidth + 'px'
      })
    })
  }
}
