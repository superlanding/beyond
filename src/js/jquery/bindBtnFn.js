export default function bindBtnFn(beyond, $) {

  const { Btn } = beyond

  $.fn.btn = function() {

    const btns = this.map((i, dom) => new Btn(dom))

    this.showLoader = btns.each((i, a) => a.showLoader())

    this.hideLoader = btns.each((i, a) => a.hideLoader())

    this.destroy = () => btns.each((i, a) => a.destroy())

    return this
  }
}
