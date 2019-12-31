const { Tooltip } = window.beyond.default

document.querySelectorAll('[data-tooltip]')
  .forEach(dom => {
    const tooltip = new Tooltip(dom)
  })
