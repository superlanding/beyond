const { Datepicker } = window.beyond.default

document.querySelectorAll('[data-datepicker]').forEach(dom => {

  const datepicker = new Datepicker(dom)
})
