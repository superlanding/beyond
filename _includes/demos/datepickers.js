import intlReady from '../../assets/js/intlReady'
import { zonedTimeToUtc } from 'date-fns-tz'
const { Datepicker } = window.beyond

intlReady()
  .then(() => {
    const date = zonedTimeToUtc('2018-09-01 18:01:36.386', 'Asia/Taipei')
    Array.from(document.querySelectorAll('[data-datepicker]'))
      .forEach(dom => new Datepicker(dom, date))
  })
