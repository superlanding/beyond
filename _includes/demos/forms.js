(function() {
  const { Radio, Checkbox } = window.beyond
  document.querySelectorAll('input[type="radio"]')
    .forEach(r => {
      new Radio(r)
    })
  document.querySelectorAll('input[type="checkbox"]')
    .forEach(c => {
      new Checkbox(c)
    })
})()
