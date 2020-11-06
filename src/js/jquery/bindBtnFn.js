export default function bindBtnFn(beyond, $) {

  $.fn.btn = function(type) {

    if (type === 'loading') {
      initBtns(this)
      this.each((i, dom) => dom._btn.showLoader())
    }
    else if (type === 'reset') {
      initBtns(this)
      this.each((i, dom) => dom._btn.hideLoader())
    }
    else if (type === 'destroy') {
      this.each((i, dom) => {
        if (dom._btn) {
          dom._btn.destroy()
          delete dom._btn
        }
      })
    }
    return this
  }
}

function initBtns(self, options) {
  const { Btn } = beyond
  self.each((i, dom) => {
    if (! dom._btn) {
      dom._btn = new Btn(dom)
    }
  })
}
