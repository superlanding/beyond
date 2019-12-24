import './../sass/index.scss'
import './polyfills/nodeRemove'
import './polyfills/nodeContains'
import Dropdown from './components/Dropdown'
import Tabbox from './components/Tabbox'
import Modal from './components/Modal'
import Tooltip from './components/Tooltip'
import Toast from './components/Toast'
import Datepicker from './components/Datepicker'

if (typeof window !== 'undefined') {
  window.beyond = {
    Dropdown,
    Modal,
    Tabbox,
    Tooltip,
    Toast,
    Datepicker
  }
}

export {
  Dropdown,
  Modal,
  Tabbox,
  Tooltip,
  Toast,
  Datepicker
}
