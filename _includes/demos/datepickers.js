import intlReady from '../../assets/js/intlReady'
import { zonedTimeToUtc } from 'date-fns-tz'

const { DateTimeRanger } = window.beyond

intlReady()
  .then(() => {
    document.querySelectorAll('[data-date-time-ranger]')
      .forEach(dom => new DateTimeRanger(dom, {
        startDate: zonedTimeToUtc('2018-09-01 18:01:36.386', 'Asia/Taipei'),
        endDate: zonedTimeToUtc('2018-09-03 18:01:36.386', 'Asia/Taipei')
      }))
  })
