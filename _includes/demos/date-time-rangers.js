import endOfDay from 'date-fns/endOfDay'
import intlReady from '../../assets/js/intlReady'

const { DateTimeRanger } = window.beyond
const locale = 'Asia/Taipei'
const pattern = 'yyyy-MM-dd hh:mm:ss'

const dateToTimestamp = date => parseInt(+date / 1000, 10)

intlReady()
  .then(() => {
    document.querySelectorAll('[data-date-time-ranger]')
      .forEach(dom => new DateTimeRanger(dom, {
        startAt: dateToTimestamp(new Date()),
        endAt: dateToTimestamp(endOfDay(new Date())),
      }))
  })
