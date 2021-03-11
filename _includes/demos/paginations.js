export default function bindPaginations() {

  const { Pagination } = window.beyond
  const dom = document.getElementById('pagination')

  if (! dom) {
    return () => {}
  }

  const pagination = new Pagination({
    dom,
    page: 2,
    total: 10,
    change(page) {
      console.log('page', page)
    }
  })

  return function unbindPaginations() {
  }
}
