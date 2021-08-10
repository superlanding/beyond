export default function bindJqueryModal() {

  const btn = document.getElementById('jq-modal-btn')
  const replaceBtn = document.getElementById('jq-modal-replace-btn')
  const uniqBtn = document.getElementById('jq-uniq-modal-btn')

  const html = `
    <div class="modal jquery-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">視窗標題</h5>
            <button type="button" class="btn-close" data-close aria-label="Close">
              <i class="icon icon-cross"></i>
            </button>
          </div>
          <div class="modal-body bg-content">
            換掉了...
          </div>
          <div class="modal-footer">
            <button data-cancel class="btn">取消</button>
            <button data-confirm class="btn btn-primary">確認</button>
          </div>
        </div>
      </div>
    </div>
  `

  const onBtnClick = () => {
    $('.jquery-modal').modal('show')
    setTimeout(() => {
      console.log('open?', $('.jquery-modal').modal('open?'))
    }, 1000)
  }

  const onReplaceBtnClick = () => {
    $('.jquery-modal').modal('show', html)
  }

  const onUniqBtnClick = () => {
    $.uniqModal().modal('show')
  }

  if (btn) {
    btn.addEventListener('click', onBtnClick)
  }
  if (replaceBtn) {
    replaceBtn.addEventListener('click', onReplaceBtnClick)
  }
  if (uniqBtn) {
    uniqBtn.addEventListener('click', onUniqBtnClick)
  }

  return function unbindJqueryModal() {

    if (btn) {
      btn.removeEventListener('click', onBtnClick)
    }
    if (replaceBtn) {
      replaceBtn.removeEventListener('click', onReplaceBtnClick)
    }
    if (uniqBtn) {
      uniqBtn.removeEventListener('click', onUniqBtnClick)
    }
  }
}
