const { Btn } = window.beyond
const btns = Array.from(document.querySelectorAll('[data-btn]'))
  .map(dom => new Btn(dom))

btns.forEach(btn => {
  btn.addEvent(btn.dom, 'click', () => {
    btn.setLoading(! btn.loading)
  })
})
