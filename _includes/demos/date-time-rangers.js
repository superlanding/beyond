import endOfDay from 'date-fns/endOfDay'
import intlReady from '../../assets/js/intlReady'

export default function bindDateTimeRangers() {

  const { DateTimeRanger } = window.beyond

  const dateToTimestamp = date => parseInt(+date / 1000, 10)

  intlReady()
    .then(() => {
      document.querySelectorAll('[data-date-time-ranger]')
        .forEach(dom => new DateTimeRanger(dom, {
          startAt: dateToTimestamp(new Date()),
          endAt: dateToTimestamp(endOfDay(new Date())),
        }))
    })
}
