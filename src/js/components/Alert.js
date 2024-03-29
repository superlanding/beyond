import supportDom from '../decorators/supportDom'

@supportDom
export default class Alert {

  constructor(dom) {
    this.dom = dom
    this.init()
    this.addEvents()
  }

  addEvents() {
    const { dom } = this
    const btns = dom.querySelectorAll('[data-dismiss="alert"]')

    btns.forEach(btn => {
      this.addEvent(btn, 'click', () => {
        this.destroy()
        this.dom.remove()
      })
    })
  }
}
