import './../sass/index.scss'
import Dropdown from './dropdown'
import Tabbox from './tabbox'

if (typeof window !== 'undefined') {
  window.beyond = {
    Dropdown,
    Tabbox
  }
}

export {
  Dropdown,
  Tabbox
}
