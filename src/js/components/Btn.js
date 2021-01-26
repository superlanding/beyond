import supportDom from '../decorators/supportDom'
import { toPixel } from '../utils'

@supportDom
export default class Btn {

  constructor(dom) {
    this.dom = dom
    this.loading = false
    this.init()
  }

  showLoader() {
    const { dom } = this
    this.innerHtml = dom.innerHTML
    dom.style.height = toPixel(dom.offsetHeight)
    dom.style.width = toPixel(dom.offsetWidth)
    dom.innerHTML = `
      <div class="btn-loader">
        <div class="ring-loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    `
  }

  hideLoader() {
    const { dom } = this
    dom.style.removeProperty('width')
    dom.style.removeProperty('height')

    const { innerHtml } = this

    if (innerHtml) {
      dom.innerHTML = innerHtml
    }
  }

  setLoading(loading) {
    this.loading = loading
    loading ? this.showLoader() : this.hideLoader()
  }
}
