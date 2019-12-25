import supportDom from '../helpers/supportDom'

@supportDom
export default class DatepickerBtnArrow {

  constructor(dom) {
    this.dom = dom
    this.init()
  }

  init() {
    this.addEvents()
  }

  addEvents() {
    const { dom } = this
    this._handleClick = event => this.fire('click', event)
    dom.addEventListener('click', this._handleClick, false)
  }

  destroy() {
    this.dom.removeEventListener('click', this._handleClick, false)
  }
}
