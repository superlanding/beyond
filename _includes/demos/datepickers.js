import intlReady from '../../assets/js/intlReady'
const { Datepicker } = window.beyond

const dateToTimestamp = date => parseInt(+date / 1000, 10)

intlReady()
  .then(() => {
    const timestamp = dateToTimestamp(new Date())
    Array.from(document.querySelectorAll('[data-datepicker]'))
      .forEach(dom => new Datepicker(dom, timestamp))
  })
