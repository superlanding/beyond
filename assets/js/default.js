import 'core-js/stable'
import 'regenerator-runtime/runtime'
import './codebox'
const { Codebox, Sidebar } = window.beyond

document.querySelectorAll('[data-codebox]')
  .forEach(dom => new Codebox(dom))

new Sidebar(document.querySelector('[data-sidebar-opener]'))
