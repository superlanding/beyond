import intlReady from '../../assets/js/intlReady'

export default function bindDatepickers() {
  const { Datepicker, Timepicker } = window.beyond
  const dateToTimestamp = date => parseInt(+date / 1000, 10)

  let datepickers = []
  let timepickers = []
  let unbound = false

  intlReady()
    .then(() => {
      if (unbound) {
        return
      }
      const timestamp = dateToTimestamp(new Date())
      datepickers = Array.from(document.querySelectorAll('[data-datepicker]'))
        .map(dom => new Datepicker(dom, timestamp))

      timepickers = Array.from(document.querySelectorAll('[data-timepicker]'))
        .map(dom => new Timepicker(dom, timestamp))
    })

  return function unbindDatepickers() {
    unbound = true
    datepickers.forEach(d => d.destroy())
    timepickers.forEach(d => d.destroy())
  }
}
