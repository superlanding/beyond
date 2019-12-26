const { Codebox, Tabbox, Modal, Tooltip } = window.beyond

document.querySelectorAll('[data-codebox]')
  .forEach(dom => {
    const codebox = new Codebox(dom)
  })

document.querySelectorAll('[data-tabbox]')
  .forEach(dom => {
    const tabbox = new Tabbox(dom, {
      change(data) {
        console.log('change', data)
      }
    })
  })

document.querySelectorAll('[data-modal-opener]')
  .forEach(dom => {
    const modal = new Modal(dom, {
      confirm() {
        console.log('confirmed')
      },
      cancel(type) {
        console.log('cancelled', type)
      }
    })
  })

document.querySelectorAll('[data-tooltip]')
  .forEach(dom => {
    const tooltip = new Tooltip(dom)
  })
