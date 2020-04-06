export default function bindBtns() {
  const { Btn } = window.beyond
  document.querySelectorAll('[data-btn]')
    .forEach(dom => {
      const btn = new Btn(dom)
      dom.addEventListener('click', () => {
        btn.setLoading(! btn.loading)
      })
    })
}
