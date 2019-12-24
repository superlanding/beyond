export default class DatepickerBtnArrow {

  constructor(dom) {
    this.dom = dom
    this.listeners = []
    this.init()
  }

  init() {
    this.addEvents()
  }

  on(name, func) {
    this.listeners.push({ name, func })
  }

  addEvents() {
    const { dom } = this
    this._handleClick = event => {
      this.listeners.filter(row => row.name === 'click')
        .forEach(row => row.func.call(this, event))
    }
    dom.addEventListener('click', this._handleClick, false)
  }

  destroy() {
    this.dom.removeEventListener('click', this._handleClick, false)
    this.listeners.length = 0
  }
}
