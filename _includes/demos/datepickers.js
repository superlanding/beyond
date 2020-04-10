import intlReady from '../../assets/js/intlReady'

export default function bindDatepickers() {
  const { Datepicker } = window.beyond
  const dateToTimestamp = date => parseInt(+date / 1000, 10)

  let datepickers = []
  let unbound = false

  intlReady()
    .then(() => {
      if (unbound) {
        return
      }
      const timestamp = dateToTimestamp(new Date())
      datepickers = Array.from(document.querySelectorAll('[data-datepicker]'))
        .map(dom => new Datepicker(dom, timestamp))
    })

  return function unbindDatepickers() {
    datepickers.forEach(d => d.destroy())
  }
}
