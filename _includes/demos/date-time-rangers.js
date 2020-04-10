import endOfDay from 'date-fns/endOfDay'
import intlReady from '../../assets/js/intlReady'

export default function bindDateTimeRangers() {

  const { DateTimeRanger } = window.beyond

  const dateToTimestamp = date => parseInt(+date / 1000, 10)
  let dateTimeRangers = []
  let unbound = false

  intlReady()
    .then(() => {
      if (unbound) {
        return
      }
      dateTimeRangers = Array.from(document.querySelectorAll('[data-date-time-ranger]'))
        .map(dom => new DateTimeRanger(dom, {
          startAt: dateToTimestamp(new Date()),
          endAt: dateToTimestamp(endOfDay(new Date())),
        }))
    })

  return function unbindDateTimeRangers() {
    unbound = true
    dateTimeRangers.forEach(d => d.destroy())
  }
}
