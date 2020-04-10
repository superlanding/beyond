import './codebox'
import bindAutocompletes from '../../_includes/demos/autocompletes'
import bindBtns from '../../_includes/demos/btns'
import bindCodeboxes from './bindCodeboxes'
import bindDateTimeRangers from '../../_includes/demos/date-time-rangers'
import bindDatepickers from '../../_includes/demos/datepickers'
import bindModals from '../../_includes/demos/modals'
import bindSearchDropdowns from '../../_includes/demos/search-dropdowns'
import bindToasts from '../../_includes/demos/toasts'
import bindWidthPad from './bindWidthPad'

const { beyond, Turbolinks, $ } = window
const { docReady } = beyond
const bindJQuery = window['beyond-jquery'].default
const unbinds = []

Turbolinks.start()

document.addEventListener('turbolinks:before-render', () => unbindAll())
document.addEventListener('turbolinks:render', () => bindAll())

docReady()
  .then(() => bindAll())

function bindAll() {
  bindJQuery(beyond, $)
  unbinds.push(bindCodeboxes())
  unbinds.push(bindWidthPad())

  beyond.bind()

  // jQuery plugins
  /*$('[data-alert]').alert()
  $('input[type="checkbox"]').checkbox()
  $('[data-dropdown]').dropdown()
  $('[data-menu-toggle]').menu()
  $('[data-navbar]').navbar()
  $('input[type="radio"]').radio()
  $('[data-sidebar-opener]').sidebar()
  $('[data-tabbox]').tabbox()
  $('[data-tooltip]').tooltip()*/

  bindAutocompletes()
  bindBtns()
  bindDateTimeRangers()
  bindDatepickers()
  bindModals()
  bindSearchDropdowns()
  bindToasts()
}

function unbindAll() {
  unbinds.forEach(unbind => unbind())
  beyond.unbindAll()
}
