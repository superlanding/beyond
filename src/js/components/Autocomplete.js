import debounce from 'lodash.debounce'
import AutocompleteMenu from './AutocompleteMenu'
import promisify from '../helpers/promisify'
import noop from 'lodash.noop'

export default class Autocomplete {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
    this.options.getData = promisify(this.options.getData || noop)
    this.isCompositing = false
    this.rows = []

    const { dataset } = dom
    const offsetLeft = ('offsetLeft' in dataset) ? parseInt(dataset.offsetLeft, 10) : 0
    const offsetTop = ('offsetTop' in dataset) ? parseInt(dataset.offsetTop, 10) : 0

    this.menu = new AutocompleteMenu({ offsetLeft, offsetTop })
    this.init()
  }

  init() {
    this.addEvents()
  }

  renderMenu() {
    this.menu.renderMenu(this.rows, row => {
      return `
        <div class="item">
          <div class="page-prefix">${row.prefix}</div>
          <div class="page-title">${row.title}</div>
        </div>
      `;
    })
  }

  async getData() {
    const lastKeyword = this.dom.value
    const rows = await this.options.getData({ keyword: lastKeyword })
    if (lastKeyword !== this.dom.value) {
      return
    }
    const { menu } = this
    this.rows = rows
    this.renderMenu()

    if (rows.length > 0) {
      menu.show(this.dom)
      return
    }
    menu.hide()
  }

  addEvents() {
    const { dom, menu } = this

    menu.on('click', index => {
      const { itemClick } = this.options
      if (typeof itemClick === 'function') {
        clearTimeout(this._blurTimer)
        const value = itemClick(this.rows[index])
        this.dom.value = value
        this.menu.hide()
      }
    })

    this._handleFocus = () => {
      if (this.rows.length === 0) {
        this.getData()
      }
      else {
        this.menu.show(this.dom)
      }
    }
    dom.addEventListener('focus', this._handleFocus, false)

    this._handleBlur = () => {
      this._blurTimer = setTimeout(() => this.menu.hide(), 300)
    }
    dom.addEventListener('blur', this._handleBlur, false)

    this._handleKeyUp = debounce(event => {
      if (this.isCompositing) {
        return
      }
      this.getData()
    }, 300)
    dom.addEventListener('keyup', this._handleKeyUp, false)

    this._handleCompositionStart = () => this.isCompositing = true
    dom.addEventListener('compositionstart', this._handleCompositionStart, false)

    this._handleCompositionEnd = () => {
      this.getData()
      this.isCompositing = false
    }
    dom.addEventListener('compositionend', this._handleCompositionEnd, false)
  }

  destroy() {
    const { dom, menu } = this
    menu.destroy()
    dom.removeEventListener('focus', this._handleFocus, false)
    dom.removeEventListener('blur', this._handleBlur, false)
    dom.removeEventListener('keyup', this._handleKeyUp, false)
    dom.removeEventListener('compositionstart', this._handleCompositionStart, false)
    dom.removeEventListener('compositionend', this._handleCompositionEnd, false)
  }
}
