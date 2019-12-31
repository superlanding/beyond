const { Modal } = window.beyond.default

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
