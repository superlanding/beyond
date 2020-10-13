import raf from '../utils/raf'
import isStr from '../utils/isStr'
import supportDom from '../decorators/supportDom'
import getKey from '../utils/getKey'

@supportDom
export default class TagInput {

  constructor(dom, options = {}) {
    this.dom = dom
    this.defaultInputWidth = 128
    this.isTag = options.isTag || (() => true)
    this.change = options.change || (() => {})
    this.isComposing = false
    this.raf = raf
    this.tags = []
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

  async addTagIfNeeded(value) {
    const { input } = this
    const inputValue = input.value
    const isValidTag = await this.isTag(inputValue)
    if (! isValidTag) {
      return
    }
    const classname = isStr(isValidTag) ? ` ${isValidTag}` : ''
    const tag = document.createElement('div')

    tag.className = 'tag' + classname
    tag.textContent = inputValue

    const btn = document.createElement('button')
    btn.type = 'button'

    // https://wesbos.com/times-html-entity-close-button
    btn.textContent = '×'
    const handleBtnClick = () => {
      this.tags = this.tags.filter(row => row.elem !== tag)
      btn.removeEventListener('click', handleBtnClick)
      tag.remove()
    }
    btn.addEventListener('click', handleBtnClick)
    tag.appendChild(btn)

    this.tags.push({ elem: tag, remove: handleBtnClick })

    this.dom.insertBefore(tag, input)

    input.value = ''
  }

  removeTagIfNeeded() {
    const lastTag = this.tags[this.tags.length - 1]
    if ((this.input.value === '') && lastTag) {
      lastTag.remove()
    }
  }

  addEvents() {
    const { input } = this
    const font = window.getComputedStyle(input)
      .getPropertyValue('font')

    this.addEvent(this.dom, 'click', event => {
      if (event.target === this.dom) {
        this.input.focus()
      }
    })

    this.addEvent(input, 'compositionstart', event => {
      this.isComposing = true
    })

    this.addEvent(input, 'compositionend', event => {
      this.isComposing = false
    })

    let lastValue = ''

    this.addEvent(input, 'keydown', async event => {
      const key = getKey(event)
      if ((key === 'enter') && (! this.isComposing)) {
        await this.addTagIfNeeded(input.value)
      }
      else if ((key === 'backspace') && (lastValue === '')) {
        this.removeTagIfNeeded()
      }
      lastValue = input.value
    })

    this.addEvent(input, 'input', event => {
      this.raf(() => {
        const textWidth = this.getTextWidth(input.value, font)
        const nextWidth = this.getNextInputWidth(textWidth)
        input.style.width = nextWidth + 'px'
      })
    })
  }
}
