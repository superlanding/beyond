import './../sass/index.scss'
import './polyfills/node-remove'
import Dropdown from './dropdown'
import Tabbox from './tabbox'
import Modal from './modal'
import Tooltip from './tooltip'

if (typeof window !== 'undefined') {
  window.beyond = {
    Dropdown,
    Modal,
    Tabbox,
    Tooltip
  }
}

export {
  Dropdown,
  Modal,
  Tabbox,
  Tooltip
}
