export default function bindToastFn(beyond, $) {

  const { Toast } = beyond

  $.fn.toast = options => new Toast(options)
}
