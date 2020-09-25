export default function domEval(code) {
  const script = document.createElement('script')
  script.text = code
  document.head.appendChild(script).parentNode.removeChild(script)
}
