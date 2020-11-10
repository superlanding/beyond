import intlReady from '../../assets/js/intlReady'
import set from 'date-fns/set'

export default function bindDatepickers() {
  const { DateMenu, Datepicker, Timepicker, MonthMenu, Monthpicker, $$ } = window.beyond
  const dateToTimestamp = date => parseInt(+date / 1000, 10)

  let datepickers = []
  let timepickers = []
  let monthpickers = []
  let dateMenus = []
  let monthMenus = []
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


      monthpickers = $$('[data-monthpicker]')
        .map(dom => {
          const date = new Date()
          return new Monthpicker(dom, { date })
        })

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

      monthMenus = $$('[data-month-menu]')
        .map(dom => {
          return new MonthMenu({
            dom,
            date: new Date()
          })
        })
    })

  return function unbindDatepickers() {
    unbound = true
    datepickers.forEach(d => d.destroy())
    timepickers.forEach(d => d.destroy())
    monthpickers.forEach(d => d.destroy())
    dateMenus.forEach(d => d.destroy())
    monthMenus.forEach(d => d.destroy())
  }
}
