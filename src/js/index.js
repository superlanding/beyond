import './../sass/index.scss'
import './polyfills/nodeContains'
import './polyfills/nodeHasAttribute'
import './polyfills/nodeRemove'
import Datepicker from './components/Datepicker'
import Dropdown from './components/Dropdown'
import Modal from './components/Modal'
import Tabbox from './components/Tabbox'
import Toast from './components/Toast'
import Tooltip from './components/Tooltip'

const hasWindow = (typeof window !== 'undefined')
const isCommonJs = ((typeof module === 'object') && (typeof module.exports === 'object'))

if (hasWindow && (! isCommonJs)) {
  window.beyond = {
    Datepicker,
    Dropdown,
    Modal,
    Tabbox,
    Toast,
    Tooltip
  }
}

export {
  Datepicker,
  Dropdown,
  Modal,
  Tabbox,
  Toast,
  Tooltip
}
