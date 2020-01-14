const { Datepicker } = window.beyond

document.querySelectorAll('[data-datepicker]')
  .forEach(dom => new Datepicker(dom))
