const { Codebox, Dropdown, Tabbox, Modal } = window.beyond

document.querySelectorAll('[data-codebox]').forEach(dom => {
  const codebox = new Codebox(dom)
})

document.querySelectorAll('[data-tabbox]').forEach(dom => {
  const tabbox = new Tabbox(dom)
})

document.querySelectorAll('[data-dropdown]').forEach(dom => {
  const dropdown = new Dropdown(dom)
})

document.querySelectorAll('[data-modal-opener]').forEach(dom => {
  const modal = new Modal(dom, {
    confirm() {
      console.log('confirmed')
    },
    cancel(type) {
      console.log('cancelled', type)
    }
  })
})
