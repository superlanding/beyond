import intlReady from '../../assets/js/intlReady'

const { Datepicker } = window.beyond

intlReady()
  .then(() => {
    document.querySelectorAll('[data-datepicker]')
      .forEach(dom => new Datepicker(dom))
  })
