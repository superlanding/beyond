import supportDom from '../decorators/supportDom'

@supportDom
export default class TagInput {

  constructor(dom) {
    this.dom = dom
    this.init()
  }

  init() {
    this.appendInput()
  }

  appendInput() {
    const input = document.createElement('input')
    this.input = input
    this.dom.append(input)
  }
}
