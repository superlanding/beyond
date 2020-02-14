import noop from 'lodash.noop'
import supportDom from '../helpers/supportDom'
import Dropdown from './Dropdown'

@supportDom
export default class Tabbox {

  constructor(dom, options = {}) {
    this.currentNode = null
    this.optionEl = null
    this.dom = dom
    this.options = options
    this.options.change = options.change || noop
    this.options.click = options.click || noop
    this.init()
  }

  init() {
    const { dom } = this
    this.btns = Array.from(dom.querySelectorAll('button[data-tabbox-item]'))
    this.dropdownBtns = Array.from(dom.querySelectorAll('button[data-tabbox-dropdown]'))
    this.addEvents()
    this.appendSlider()
  }

  adjustSlider() {
    const [firstBtn] = this.btns
    if (! firstBtn) {
      return
    }
    const { slider } = this
    slider.style.top = (firstBtn.offsetHeight - slider.offsetHeight) + 'px'
    slider.style.left = firstBtn.offsetLeft + 'px'
  }

  moveTo(name) {
    const target = this.dom.querySelector(`[data-tabbox-item=${name}]`)
    if (target) {
      this.removeCurrentClass()
      this.currentNode = target
      this.moveToCurrentNode()
      this.addCurrentClass()
    }
  }

  eachDropdownOption(fn) {
    let index = 0
    for (const d of this.dropdownInstances) {
      const options = Array.from(d.menu.querySelectorAll('[data-tabbox-item]'))
      for (const optionEl of options) {
        const going = fn({
          dropdownBtn: this.dropdownBtns[index],
          dropdownInstance: d,
          optionEl
        })
        if (going === false) {
          return
        }
      }
      ++index
    }
  }

  getDefaultDropdownData() {

    let res = {}

    this.eachDropdownOption(({ dropdownBtn, dropdownInstance, optionEl }) => {
      if ('default' in optionEl.dataset) {
        res = {
          defaultDropdownBtn: dropdownBtn,
          defaultDropdownInstance: dropdownInstance,
          defaultOptionEl: optionEl
        }
        return false
      }
    })
    return res
  }

  appendSlider() {
    this.slider = document.createElement('div')
    this.slider.classList.add('js-slider')
    this.dom.appendChild(this.slider)
    const defaultBtn = this.btns.find(btn => 'default' in btn.dataset)

    this.adjustSlider()

    if (defaultBtn) {
      this.currentNode = defaultBtn || defaultSelectBox
      this.moveToCurrentNode()
      this.addCurrentClass()
    }

    const { defaultDropdownBtn, defaultDropdownInstance,
      defaultOptionEl } = this.getDefaultDropdownData()

    if (defaultDropdownBtn) {
      this.currentNode = defaultDropdownBtn
      this.optionEl = defaultOptionEl
      this.moveToCurrentNode()
      this.addCurrentClass()
      defaultDropdownInstance.setText(this.optionEl.textContent)
    }
  }

  setSliderColor(color) {
    this.slider.style.backgroundColor = color
  }

  moveToCurrentNode() {
    const node = this.currentNode
    if (! node) {
      return
    }
    if ('tabboxDropdown' in node.dataset) {
      return this.moveSlider({
        top: node.offsetTop,
        left: node.offsetLeft,
        width: node.offsetWidth,
        color: this.optionEl.dataset.activeColor
      })
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

  setStatus(status) {
    const btn = this.btns.find(btn => btn.dataset.tabboxItem === status)
    if (btn) {
      this.removeCurrentClass()
      this.currentNode = btn
      this.moveToCurrentNode()
      this.addCurrentClass()
      this.options.change({ id: status, type: 'btn' })
      return
    }

    let dropdownMatched = false
    this.eachDropdownOption(({ dropdownBtn, dropdownInstance, optionEl }) => {
      if (status === optionEl.dataset.tabboxItem) {
        this.setDropdown({ dropdownBtn, dropdownInstance, optionEl })
        this.options.change({ id: status, type: 'dropdown' })
        dropdownMatched = true
        return false
      }
    })

    if (! dropdownMatched) {
      throw new Error(`Cannot find status: ${status}`)
    }
  }

  setDropdown({ dropdownBtn, dropdownInstance, optionEl }) {
    this.currentNode = dropdownBtn
    this.optionEl = optionEl
    this.moveToCurrentNode()

    this.dropdownInstances.filter(d => d !== dropdownInstance)
      .forEach(d => d.restoreText())
    dropdownInstance.setText(this.optionEl.textContent)
  }

  addEvents() {
    this.dropdownInstances = this.dropdownBtns.map(el => {
      const dropdownInstance = new Dropdown(el, {
        menuClick: event => {
          const id = event.target.dataset.tabboxItem
          this.options.click({ id, type: 'dropdown' })

          if (this.optionEl === event.target) {
            return
          }
          this.setDropdown({
            dropdownBtn: el,
            optionEl: event.target,
            dropdownInstance
          })
          this.options.change({ id, type: 'dropdown' })
        }
      })
      return dropdownInstance
    })

    this.btns.forEach(btn => {
      this.addEvent(btn, 'click', () => {
        const id = btn.dataset.tabboxItem
        this.options.click({ id, type: 'btn' })
        if (btn !== this.currentNode) {
          this.removeCurrentClass()
          this.currentNode = btn
          this.optionEl = null
          this.moveToCurrentNode()
          this.addCurrentClass()
          this.options.change({ id, type: 'btn' })
        }
      })
    })
  }

  destroy() {
    this.currentNode = null
    this.dropdownInstances.forEach(d => d.destroy())
    this.slider.parentNode.removeChild(this.slider)
  }
}
