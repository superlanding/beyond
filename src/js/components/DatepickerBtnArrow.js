import supportDom from '../utils/supportDom'

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
    this.addEvent(this.dom, 'click', event => this.fire('click', event))
  }
}
