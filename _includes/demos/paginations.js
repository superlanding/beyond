export default function bindPaginations() {

  const { Pagination } = window.beyond
  const dom = document.getElementById('pagination')

  if (! dom) {
    return () => {}
  }

  const pagination = new Pagination({
    dom,
    page: 1,
    total: 7
  })

  return function unbindPaginations() {
  }
}
