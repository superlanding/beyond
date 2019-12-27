import debounce from 'lodash.debounce'
import AutocompleteMenu from './AutocompleteMenu'

export default class Autocomplete {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
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

  getData(keyword) {
    return new Promise(resolve => {
      const { getData } = this.options
      if (typeof getData !== 'function') {
        throw new Error('options.getData must be defined')
      }
      const res = getData({ keyword })
      if (res instanceof Promise) {
        res.then(data => resolve(data))
        return
      }
      resolve(res)
    })
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

  handleData(rows) {
    const { menu } = this
    this.rows = rows
    if (rows.length > 0) {
      menu.show(this.dom)
    }
    else {
      menu.hide()
    }
    this.renderMenu()
  }

  showData() {
    const lastKeyword = this.dom.value
    this.getData(lastKeyword)
      .then(rows => {
        if (lastKeyword === this.dom.value) {
          this.handleData(rows)
        }
      })
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

    this._handleFocus = () => this.showData()
    dom.addEventListener('focus', this._handleFocus, false)

    this._handleBlur = () => {
      this._blurTimer = setTimeout(() => this.menu.hide(), 300)
    }
    dom.addEventListener('blur', this._handleBlur, false)

    this._handleKeyUp = debounce(event => {
      if (this.isCompositing) {
        return
      }
      this.showData()
    }, 300)
    dom.addEventListener('keyup', this._handleKeyUp, false)

    this._handleCompositionStart = () => this.isCompositing = true
    dom.addEventListener('compositionstart', this._handleCompositionStart, false)

    this._handleCompositionEnd = () => {
      this.showAsyncData()
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
