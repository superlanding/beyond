export default function bindModals() {

  const { Modal } = window.beyond

  const modals = Array.from(document.querySelectorAll('[data-modal-opener]'))
    .map(dom => new Modal(dom, {
      confirm() {
        console.log('confirmed')
      },
      cancel(type) {
        console.log('cancelled', type)
      }
    }))

  return function unbindModals() {
    modals.forEach(m => m.destroy())
  }
}
