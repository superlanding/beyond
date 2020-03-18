(function() {
  const { Radio, Checkbox } = window.beyond
  document.querySelectorAll('.label-radio input[type="radio"]')
    .forEach(r => {
      new Radio(r)
    })
  document.querySelectorAll('.label-checkbox input[type="checkbox"]')
    .forEach(c => {
      new Checkbox(c)
    })
})()
