const { Dropdown } = window.beyond.default

document.querySelectorAll('[data-dropdown]')
  .forEach(dom => {
    const dropdown = new Dropdown(dom)
  })
