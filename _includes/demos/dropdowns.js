const { Dropdown } = window.beyond

document.querySelectorAll('[data-dropdown]')
  .forEach(dom => {
    const dropdown = new Dropdown(dom)
  })
