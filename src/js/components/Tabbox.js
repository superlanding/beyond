import noop from 'lodash.noop'
import supportDom from '../helpers/supportDom'

@supportDom
export default class Tabbox {

  constructor(dom, options = {}) {
    this.currentNode = null
    this.dom = dom
    this.options = options
    this.options.change = options.change || noop
    this.init()
  }

  init() {
    this.btns = Array.from(this.dom.querySelectorAll('button[data-tabbox-item]'))
    this.selectBoxes = Array.from(this.dom.querySelectorAll('div[data-tabbox-item]'))
    this.selects = Array.from(this.dom.querySelectorAll('div[data-tabbox-item] select'))
    this.appendSlider()
    this.addEvents()
  }

  adjustSlider() {
    const [firstBtn] = this.btns
    if (firstBtn) {
      this.slider.style.top = (firstBtn.offsetHeight - this.slider.offsetHeight) + 'px'
    }
  }

  appendSlider() {
    this.slider = document.createElement('div')
    this.slider.classList.add('js-slider')
    this.dom.appendChild(this.slider)
    const defaultBtn = this.btns.find(btn => 'default' in btn.dataset)

    this.adjustSlider()

    if (defaultBtn) {
      this.currentNode = defaultBtn
      this.moveToCurrentNode()
      this.addCurrentClass()
    }
  }

  setSliderColor(color) {
    this.slider.style.backgroundColor = color
  }

  moveToCurrentNode() {
    let node = this.currentNode
    if (! node) {
      return
    }
    if (node.tagName === 'SELECT') {
      node = node.parentNode
    }
    this.moveSlider({
      top: node.offsetTop,
      left: node.offsetLeft,
      width: node.offsetWidth,
      color: node.dataset.activeColor
    })
  }

  moveSlider({ top, left, width, color = '#858585' }) {
    this.slider.style.transform = `translate(${left}px, ${top}px)`
    this.slider.style.width = width + 'px'
    this.slider.style.backgroundColor = color
  }

  clearSelects(args) {
    const except = args ? args.except : null
    this.selects.forEach(select => {
      if (except && (select === except)) {
        return
      }
      select.value = ''
    })
  }

  removeCurrentClass() {
    if (this.currentNode) {
      this.currentNode.classList.remove('js-current')
    }
  }

  addCurrentClass() {
    if (this.currentNode) {
      this.currentNode.classList.add('js-current')
    }
  }

  addEvents() {
    this.btns.forEach(btn => {
      this.addEvent(btn, 'click', () => {
        if (btn !== this.currentNode) {
          this.removeCurrentClass()
          this.clearSelects()
          this.currentNode = btn
          this.moveToCurrentNode()
          this.addCurrentClass()
          this.options.change({ id: btn.dataset.tabboxItem, type: 'btn' })
        }
      })
    })

    this.selectBoxes.forEach(div => {
      const select = div.querySelector('select')

      this.addEvent(select, 'change', event => {
        if (event.target.value) {
          this.removeCurrentClass()
          this.clearSelects({ except: select })
          this.currentNode = select
          this.moveToCurrentNode()
          this.addCurrentClass()
          this.options.change({ id: event.target.value, type: 'select' })
        }
      })

      this.addEvent(select, 'focus', () => {
        select.parentNode.classList.add('js-focus')
      })

      this.addEvent(select, 'blur', () => {
        select.parentNode.classList.remove('js-focus')
      })
    })
  }

  destroy() {
    this.currentNode = null
    this.slider.parentNode.removeChild(this.slider)
  }
}
