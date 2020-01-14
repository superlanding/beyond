const { Tabbox } = window.beyond

document.querySelectorAll('[data-tabbox]')
  .forEach(dom => new Tabbox(dom))
