import './../sass/index.scss'
import '@babel/polyfill'
import './polyfills/nodeContains'
import './polyfills/nodeHasAttribute'
import './polyfills/nodeRemove'
import Autocomplete from './components/Autocomplete'
import Datepicker from './components/Datepicker'
import Dropdown from './components/Dropdown'
import Modal from './components/Modal'
import Tabbox from './components/Tabbox'
import Toast from './components/Toast'
import Tooltip from './components/Tooltip'
import Sidebar from './components/Sidebar'

const hasWindow = (typeof window !== 'undefined')
const isCommonJs = ((typeof module === 'object') && (typeof module.exports === 'object'))

if (hasWindow && (! isCommonJs)) {
  window.beyond = {
    Autocomplete,
    Datepicker,
    Dropdown,
    Modal,
    Sidebar,
    Tabbox,
    Toast,
    Tooltip
  }
}

export {
  Autocomplete,
  Datepicker,
  Dropdown,
  Modal,
  Sidebar,
  Tabbox,
  Toast,
  Tooltip
}
