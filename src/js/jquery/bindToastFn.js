import Toast from '../components/Toast'

export default function bindToastFn($) {
  $.fn.toast = options => new Toast(options)
}
