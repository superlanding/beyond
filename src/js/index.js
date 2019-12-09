import './../sass/index.scss'
import Dropdown from './dropdown'
import Tabbox from './tabbox'
import Modal from './modal'

if (typeof window !== 'undefined') {
  window.beyond = {
    Dropdown,
    Modal,
    Tabbox
  }
}

export {
  Dropdown,
  Modal,
  Tabbox
}
