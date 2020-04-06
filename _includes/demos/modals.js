export default function bindModals() {

  const { Modal } = window.beyond

  document.querySelectorAll('[data-modal-opener]').forEach(dom => {
    new Modal(dom, {
      confirm() {
        console.log('confirmed')
      },
      cancel(type) {
        console.log('cancelled', type)
      }
    })
  })
}
