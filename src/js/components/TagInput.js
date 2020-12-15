import getKey from '../utils/getKey'
import noop from '../utils/noop'
import raf from '../utils/raf'
import supportDom from '../decorators/supportDom'

@supportDom
export default class TagInput {

  constructor(dom, options = {}) {
    this.dom = dom
    this.defaultInputWidth = 128
    this.validate = options.validate || (() => ({ isTag: true }))
    this.suggest = options.suggest || noop
    this.change = options.change || noop
    this.isComposing = false
    this.raf = raf
    this.id = 0
    this.tags = []
    this.init()
  }

  init() {
    this.setup()
    this.addEvents()
  }

  setup() {
    const { defaultInputWidth } = this
    const inputDiv = document.createElement('div')
    inputDiv.className = 'tag-input-box'

    const suggestInput = document.createElement('input')
    suggestInput.type = 'text'
    suggestInput.style.width = defaultInputWidth + 'px'
    suggestInput.className = 'tag-suggest-input'

    const input = document.createElement('input')
    input.type = 'text'
    input.style.width = defaultInputWidth + 'px'
    input.className = 'tag-main-input'

    inputDiv.appendChild(input)
    inputDiv.appendChild(suggestInput)

    this.input = input
    this.suggestInput = suggestInput
    this.canvas = document.createElement('canvas')
    this.inputDiv = inputDiv

    this.dom.append(inputDiv)
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

  shake(duration = 500) {
    this.dom.classList.add('shake')
    setTimeout(() => {
      this.dom.classList.remove('shake')
    }, duration)
  }

  setTagAttrs(id, rows = [], options = {}) {
    const tag = this.tags.find(tag => tag.id === id)
    if (! tag) {
      return
    }
    const { elem } = tag
    const { timeout } = options

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    else {
      this.oldAttrs = rows.map(row => elem.getAttribute(row.name))
    }

    rows.forEach(row => {
      elem.setAttribute(row.name, row.value)
    })

    if (timeout) {
      this.timer = setTimeout(() => {
        if (document.body.contains(elem)) {
          const { oldAttrs } = this
          rows.forEach((row, i) => {
            elem.setAttribute(row.name, oldAttrs[i])
          })
        }
      }, timeout)
    }
  }

  getTag(row) {

    this.id += 1

    const id = this.id
    const classname = row.classname ? ` ${row.classname}` : ''
    const tag = document.createElement('div')

    tag.className = 'tag' + classname
    tag.textContent = row.text

    const btn = document.createElement('button')
    btn.type = 'button'

    // https://wesbos.com/times-html-entity-close-button
    btn.textContent = '×'
    const handleBtnClick = event => {
      this.tags = this.tags.filter(row => row.elem !== tag)
      btn.removeEventListener('click', handleBtnClick)
      tag.remove()

      if (event) {
        this.change({
          type: 'remove',
          removedId: id,
          tags: this.tags.slice()
        })
      }
    }
    btn.addEventListener('click', handleBtnClick)
    tag.appendChild(btn)

    return { id, elem: tag, remove: handleBtnClick, ...row }
  }

  setTags(rows) {
    this.tags.forEach(tag => tag.remove())
    const { dom, inputDiv } = this
    const tags = rows.map(row => this.getTag(row))
    tags.forEach(tag => {
      dom.insertBefore(tag.elem, inputDiv)
    })
    this.tags = tags
    this.change({
      type: 'set',
      tags: this.tags.slice()
    })
  }

  addTag(row, type = 'add') {
    const tag = this.getTag(row)
    this.tags.push(tag)
    this.dom.insertBefore(tag.elem, this.inputDiv)
    this.change({
      type,
      tags: this.tags.slice()
    })
  }

  async addTagIfNeeded() {
    const { input, suggestInput } = this
    const inputValue = suggestInput.value || input.value
    const res = await this.validate(inputValue)
    if (res.clear) {
      input.value = ''
      suggestInput.value = ''
      return
    }
    if (! res.isTag) {
      return this.shake()
    }
    input.value = ''
    suggestInput.value = ''

    const row = Object.assign({}, res, { text: inputValue })
    this.addTag(row, 'input')
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
        event.preventDefault()
        event.stopPropagation()
        await this.addTagIfNeeded()
      }
      else if ((key === 'backspace') && (lastValue === '')) {
        this.removeTagIfNeeded()
      }
      lastValue = input.value
    })

    this.addEvent(input, 'input', event => {
      this.suggestInputIfNeeded(input.value)
      this.raf(() => {
        const textWidth = this.getTextWidth(input.value, font)
        const nextWidth = this.getNextInputWidth(textWidth)
        input.style.width = nextWidth + 'px'
      })
    })
  }

  async suggestInputIfNeeded(value) {
    const suggestValue = await this.suggest(value)
    this.raf(() => {
      if (this.input.value === value) {
        this.suggestInput.value = (suggestValue || '')
      }
    })
  }

  destroy() {
    this.tags.forEach(tag => tag.remove())
    this.inputDiv.remove()
    this.canvas = null
    this.input = null
    this.suggestInput = null
    this.inputDiv = null
  }
}
