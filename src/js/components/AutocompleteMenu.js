import getFloatedTargetPos from '../helpers/getFloatedTargetPos'
import toPixel from '../helpers/toPixel'
import supportDom from '../helpers/supportDom'

@supportDom
export default class AutocompleteMenu {

  constructor(options = {}) {
    this.options = options
    this.isVisible = false
    this.lastSrc = null
    this.init()
  }

  init() {
    this.addMenu()
    this.addEvents()
  }

  pos(src) {
    console.log('wtf', this.options.offsetLeft)
    const offsetLeft = this.options.offsetLeft || 0
    const pos = getFloatedTargetPos({
      src,
      target: this.dom,
      place: 'bottom',
      align: 'left',
      offset: 3,
      offsetLeft
    })
    this.dom.style.left = toPixel(pos.left)
    this.dom.style.top = toPixel(pos.top)
    this.lastSrc = src
  }

  show(src) {
    this.dom.style.opacity = 0
    this.dom.style.display = 'block'
    this.pos(src)
    this.dom.style.opacity = 1
    this.isVisible = true
  }

  hide() {
    this.dom.style.display = 'none'
    this.isVisible = false
  }

  addMenu() {
    const dom = document.createElement('div')
    dom.className = 'autocomplete-menu'
    dom.style.display = 'none'
    document.body.appendChild(dom)
    this.dom = dom
  }

  renderMenu(rows, renderFunc) {
    const nodes = rows.map(row => renderFunc(row))
    const html = nodes.map(node => {
      if ((typeof node === 'object') && ('outerHTML' in node)) {
        return node.outerHTML
      }
      return node
    }).join('')
    this.dom.innerHTML = html
  }

  addEvents() {
    this._handleClick = event => {
      let node = event.target
      while (node.parentNode !== this.dom) {
        node = node.parentNode
      }
      const children = Array.from(this.dom.children)
      const index = children.indexOf(node)
      this.fire('click', index)
    }
    this.dom.addEventListener('click', this._handleClick, false)
    this._handleWindowResize = () => {
      if (this.isVisible && this.lastSrc) {
        this.pos(this.lastSrc)
      }
    }
    window.addEventListener('resize', this._handleWindowResize, false)
  }

  destroy() {
    const { dom } = this
    window.removeEventListener('resize', this._handleWindowResize, false)
    dom.removeEventListener('click', this._handleClick, false)
    dom.remove()
  }
}
