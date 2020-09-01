export default function bindModalFn(beyond, $) {

  $.fn.modal = function(settings, html) {

    if (typeof settings === 'string') {
      const method = settings
      initModals(this, $.fn.modal.defaults)
      if (method === 'open?') {
        return this.map((i, dom) => dom._modal.visible())
      }
      this.each((i, dom) => dom._modal[method](html))
    }
    else {
      const options = $.extend({}, $.fn.modal.defaults, settings)
      initModals(this, options)
    }

    this.destroy = () => this.each((i, dom) => dom._modal && dom._modal.destroy())

    return this
  }

  $.uniqModal = getUniqModalSelector
}

function initModals(self, options) {
  const { Modal } = beyond
  self.each((i, dom) => {
    if (! dom._modal) {
      dom._modal = new Modal(dom, options)
    }
  })
}

function getUniqModalSelector() {
  const id = 'beyond-uniq-modal'
  const dom = document.getElementById(id)
  if (dom) {
    return $(`#${id}`)
  }
  const div = document.createElement('div')
  div.id = id
  div.className = 'modal'
  div.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">視窗標題</h5>
          <button type="button" class="btn-close" data-close aria-label="Close">
            <i class="icon icon-cross"></i>
          </button>
        </div>
        <div class="modal-body bg-content">
          視窗內文
        </div>
        <div class="modal-footer">
          <button data-cancel class="btn btn-outline">取消</button>
          <button data-confirm class="btn btn-primary">確認</button>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(div)
  return $(div)
}
