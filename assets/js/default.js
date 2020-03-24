import './codebox'
import '../../_includes/demos/tabbox'
import '../../_includes/demos/toasts'
import '../../_includes/demos/modals'
import '../../_includes/demos/autocompletes'
import '../../_includes/demos/date-time-rangers'
import '../../_includes/demos/datepickers'
import '../../_includes/demos/tooltips'
import '../../_includes/demos/dropdowns'
import '../../_includes/demos/search-dropdowns'
import '../../_includes/demos/navbars'
import '../../_includes/demos/forms'

const { Codebox, Sidebar } = window.beyond

document.querySelectorAll('[data-codebox]')
  .forEach(dom => new Codebox(dom))

const sidebarDom = document.querySelector('[data-sidebar-opener]')
if (sidebarDom) {
  new Sidebar(sidebarDom)
}

const pad = document.getElementById('width-pad')
const throttle = require('lodash.throttle')
const containerTable = document.getElementById('container-table')
const colTable = document.getElementById('col-table')
const hiddenUtilsTable = document.getElementById('hidden-utils-table')
const getHighLightIndex = width => {
  if (width >= 1200) {
    return 5
  }
  if (width >= 992) {
    return 4
  }
  if (width >= 768) {
    return 3
  }
  if (width >= 576) {
    return 2
  }
  return 1
}
const highlightTableCol = (table, index) => {
  table.querySelectorAll('tr')
    .forEach((tr, trIndex) => {
      const selector = (trIndex === 0) ? 'th' : 'td'
      tr.querySelectorAll(selector)
        .forEach((cell, i) => {
          if (i === index) {
            cell.classList.add('active')
          }
          else {
            cell.classList.remove('active')
          }
        })
    })
}
const handleResize = () => {
  if (pad) {
    pad.innerText = '目前視窗寬度: ' + window.innerWidth + 'px'
  }
  const highlightIndex = getHighLightIndex(window.innerWidth)
  if (containerTable) {
    highlightTableCol(containerTable, highlightIndex)
  }
  if (colTable) {
    highlightTableCol(colTable, highlightIndex)
  }
  if (hiddenUtilsTable) {
    highlightTableCol(hiddenUtilsTable, highlightIndex)
  }
}
handleResize()
window.addEventListener('resize', throttle(handleResize, 100))
