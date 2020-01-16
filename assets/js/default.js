import './codebox'
import '../../_includes/demos/tabbox'
import '../../_includes/demos/toasts'
import '../../_includes/demos/modals'
import '../../_includes/demos/autocompletes'
import '../../_includes/demos/datepickers'
import '../../_includes/demos/tooltips'
import '../../_includes/demos/dropdowns'

const { Codebox, Sidebar } = window.beyond

document.querySelectorAll('[data-codebox]')
  .forEach(dom => new Codebox(dom))

new Sidebar(document.querySelector('[data-sidebar-opener]'))
