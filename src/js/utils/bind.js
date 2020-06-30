import Alert from '../components/Alert'
import Checkbox from '../components/Checkbox'
import Dropdown from '../components/Dropdown'
import Menu from '../components/Menu'
import Navbar from '../components/Navbar'
import Radio from '../components/Radio'
import Sidebar from '../components/Sidebar'
import Tabbox from '../components/Tabbox'
import Tooltip from '../components/Tooltip'

const $ = selector => Array.from(document.querySelectorAll(selector))

const defaultOptions = {
  selectors: {
    alert: '[data-alert]',
    checkbox: 'input[type="checkbox"]',
    dropdown: '[data-dropdown]',
    menu: '[data-menu-toggle]',
    navbar: '[data-navbar]',
    radio: 'input[type="radio"]',
    sidebar: '[data-sidebar-opener]',
    tabbox: '[data-tabbox]',
    tooltip: '[data-tooltip]'
  }
}

export default function bind(opts = {}) {

  const options = Object.assign({}, defaultOptions, opts)
  const { selectors } = options

  const alerts = $(selectors.alert).map(dom => new Alert(dom))
  const checkboxes = $(selectors.checkbox).map(dom => new Checkbox(dom))
  const dropdowns = $(selectors.dropdown).map(dom => new Dropdown(dom))
  const menus = $(selectors.menu).map(dom => new Menu(dom))
  const navbars = $(selectors.navbar).map(dom => new Navbar(dom))
  const radios = $(selectors.radio).map(dom => new Radio(dom))
  const sidebars = $(selectors.sidebar).map(dom => new Sidebar(dom))
  const tabboxes = $(selectors.tabbox).map(dom => new Tabbox(dom))
  const tooltips = $(selectors.tooltip).map(dom => new Tooltip(dom))

  return function unbind() {
    alerts.forEach(alert => alert.destroy())
    checkboxes.forEach(checkbox => checkbox.destroy())
    dropdowns.forEach(dropdown => dropdown.destroy())
    menus.forEach(menu => menu.destroy())
    navbars.forEach(navbar => navbar.destroy())
    radios.forEach(radio => radio.destroy())
    sidebars.forEach(sidebar => sidebar.destroy())
    tabboxes.forEach(tabbox => tabbox.destroy())
    tooltips.forEach(tooltip => tooltip.destroy())
  }
}
