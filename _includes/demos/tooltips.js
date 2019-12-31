const { Tooltip } = window.beyond

document.querySelectorAll('[data-tooltip]')
  .forEach(dom => {
    const tooltip = new Tooltip(dom)
  })
