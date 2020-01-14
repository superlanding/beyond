const { Tooltip } = window.beyond

document.querySelectorAll('[data-tooltip]')
  .forEach(dom => new Tooltip(dom))
