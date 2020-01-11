import debounce from 'lodash.debounce'
import AutocompleteMenu from './AutocompleteMenu'
import promisify from '../helpers/promisify'
import supportDom from '../helpers/supportDom'
import noop from 'lodash.noop'

@supportDom
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

  renderMenuItem() {
    this.menu.renderMenuItem(this.rows, row => {
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
    this.renderMenuItem()

    if (rows.length > 0) {
      this.showMenu()
      return
    }
    menu.hide()
  }

  showMenu() {
    this.menu.show(this.dom)
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

    this.addEvent(dom, 'focus', () => {
      if (this.rows.length === 0) {
        this.getData()
      }
      else {
        this.showMenu()
      }
    })

    this.addEvent(dom, 'blur', () => {
      this._blurTimer = setTimeout(() => this.menu.hide(), 50)
    })

    this.addEvent(dom, 'keyup', debounce(() => {
      if (this.isCompositing) {
        return
      }
      this.getData()
    }, 200))

    this.addEvent(dom, 'compositionstart', () => {
      this.isCompositing = true
    })

    this.addEvent(dom, 'compositionend', () => {
      this.getData()
      this.isCompositing = false
    })
  }

  destroy() {
    this.menu.destroy()
  }
}
