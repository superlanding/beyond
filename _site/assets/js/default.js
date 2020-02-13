import './codebox'
import '../../_includes/demos/tabbox'
import '../../_includes/demos/toasts'
import '../../_includes/demos/modals'
import '../../_includes/demos/autocompletes'
import '../../_includes/demos/date-time-rangers'
import '../../_includes/demos/datepickers'
import '../../_includes/demos/tooltips'
import '../../_includes/demos/dropdowns'
import '../../_includes/demos/search-dropdowns'
import '../../_includes/demos/navbars'

const { Codebox, Sidebar } = window.beyond

document.querySelectorAll('[data-codebox]')
  .forEach(dom => new Codebox(dom))

new Sidebar(document.querySelector('[data-sidebar-opener]'))