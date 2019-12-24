const { Datepicker } = window.beyond

document.querySelectorAll('[data-datepicker]').forEach(dom => {

  const datepicker = new Datepicker(dom)
})
