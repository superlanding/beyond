import './codebox'
import bindAutocompletes from '../../_includes/demos/autocompletes'
import bindBtns from '../../_includes/demos/btns'
import bindIcons from '../../_includes/demos/icons'
import bindCodeboxes from './bindCodeboxes'
import bindDateTimeRangers from '../../_includes/demos/date-time-rangers'
import bindDatepickers from '../../_includes/demos/datepickers'
import bindModals from '../../_includes/demos/modals'
import bindSearchDropdowns from '../../_includes/demos/search-dropdowns'
import bindToasts from '../../_includes/demos/toasts'
import bindWidthPad from './bindWidthPad'

const { beyond, Turbolinks, $ } = window
const bindJQuery = window['beyond-jquery'].default
const unbinds = []

Turbolinks.start()
bindJQuery(beyond, $)

document.addEventListener('turbolinks:before-cache', () => unbindAll())
document.addEventListener('turbolinks:load', () => bindAll())

function bindAll() {
  beyond.bind()

  unbinds.push(bindCodeboxes())
  unbinds.push(bindWidthPad())

  unbinds.push(bindAutocompletes())
  unbinds.push(bindBtns())
  unbinds.push(bindDateTimeRangers())
  unbinds.push(bindDatepickers())
  unbinds.push(bindModals())
  unbinds.push(bindSearchDropdowns())
  unbinds.push(bindToasts())
  unbinds.push(bindIcons())
}

function unbindAll() {
  unbinds.forEach(unbind => unbind())
  beyond.unbindAll()
}
