import './codebox'
import bindAutocompletes from '../../_includes/demos/autocompletes'
import bindBtns from '../../_includes/demos/btns'
import bindIcons from '../../_includes/demos/icons'
import bindCodeboxes from './bindCodeboxes'
import bindThemeSelect from './bindThemeSelect'
import bindLineCharts from '../../_includes/demos/line-chart'
import bindBarCharts from '../../_includes/demos/bar-chart'
import bindPieCharts from '../../_includes/demos/pie-chart'
import bindDateTimeRangers from '../../_includes/demos/date-time-rangers'
import bindDatepickers from '../../_includes/demos/datepickers'
import bindModals from '../../_includes/demos/modals'
import bindPaginations from '../../_includes/demos/paginations'
import bindSearchDropdowns from '../../_includes/demos/search-dropdowns'
import bindToasts from '../../_includes/demos/toasts'
import bindWidthPad from './bindWidthPad'
import Theme from './models/Theme'
import bindJqueryModal from '../../_includes/demos/jquery-modal'
import bindTagInputs from '../../_includes/demos/tag-input'

const { beyond, Turbolinks, $ } = window
const { docReady } = beyond
const bindJQuery = window['beyond-jquery'].default
const unbinds = []

Theme.setCssLink()

docReady()
  .then(() => bindAll())

bindJQuery(beyond, $)

function bindAll() {
  beyond.bind()

  unbinds.push(bindCodeboxes())
  unbinds.push(bindThemeSelect())
  unbinds.push(bindWidthPad())

  unbinds.push(bindAutocompletes())
  unbinds.push(bindBtns())
  unbinds.push(bindLineCharts())
  unbinds.push(bindBarCharts())
  unbinds.push(bindPieCharts())
  unbinds.push(bindDateTimeRangers())
  unbinds.push(bindDatepickers())
  unbinds.push(bindModals())
  unbinds.push(bindPaginations())
  unbinds.push(bindSearchDropdowns())
  unbinds.push(bindToasts())
  unbinds.push(bindIcons())

  unbinds.push(bindJqueryModal())
  unbinds.push(bindTagInputs())
}

function unbindAll() {
  unbinds.forEach(unbind => unbind())
  unbinds.length = 0
  beyond.unbindAll()
}
