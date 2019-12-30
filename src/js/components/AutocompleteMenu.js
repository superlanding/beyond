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
    const offsetLeft = this.options.offsetLeft || 0
    const offsetTop = this.options.offsetTop || 0
    const { pos } = getFloatedTargetPos({
      src,
      target: this.dom,
      place: 'bottom',
      align: 'left',
      offset: 3,
      offsetLeft,
      offsetTop
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
    this.addEvent(this.dom, 'click', () => {
      let node = event.target
      while (node.parentNode !== this.dom) {
        node = node.parentNode
      }
      const index = Array.from(this.dom.children).indexOf(node)
      this.fire('click', index)
    })
    this.addEvent(window, 'resize', () => {
      if (this.isVisible && this.lastSrc) {
        this.pos(this.lastSrc)
      }
    })
  }

  destroy() {
    this.dom.remove()
  }
}
