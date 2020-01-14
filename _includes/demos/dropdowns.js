const { Dropdown } = window.beyond

document.querySelectorAll('[data-dropdown]')
  .forEach(dom => new Dropdown(dom))
