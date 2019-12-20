import './../sass/index.scss'
import './polyfills/node-remove'
import './polyfills/node-contains'
import Dropdown from './components/dropdown'
import Tabbox from './components/tabbox'
import Modal from './components/modal'
import Tooltip from './components/tooltip'

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
