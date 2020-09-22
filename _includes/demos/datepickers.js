import intlReady from '../../assets/js/intlReady'
import set from 'date-fns/set'

export default function bindDatepickers() {
  const { DateMenu, Datepicker, Timepicker } = window.beyond
  const dateToTimestamp = date => parseInt(+date / 1000, 10)

  let datepickers = []
  let timepickers = []
  let dateMenus = []
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

      const date = new Date()

      dateMenus = Array.from(document.querySelectorAll('[data-date-menu]'))
        .map(dom => new DateMenu({ date, options: { dom, isStatic: true } }))
        .map(d => {
          d.on('td-click', (event, res) => {
            const { year, month, date } = res
            const newDate = set(new Date(), { year, month, date })
            d.setDate({ startDate: newDate })
          })
          d.setDate({ date, startDate: date })
          d.show()
          return d
        })
    })

  return function unbindDatepickers() {
    unbound = true
    datepickers.forEach(d => d.destroy())
    timepickers.forEach(d => d.destroy())
    dateMenus.forEach(d => d.destroy())
  }
}
