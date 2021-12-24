import Theme from './models/Theme'

export default function bindThemeSelect() {

  const select = document.getElementById('theme-select')

  const setThemeClass = theme => {
    const { classList } = document.body
    classList.forEach(classname => {
      if (classname.startsWith('theme-')) {
        classList.remove(classname)
      }
    })
    classList.add(`theme-${theme}`)
    Theme.set(theme)
    if (typeof CustomEvent === 'function') {
      const event = new CustomEvent('beyond-theme-change')
      document.dispatchEvent(event)
    }
  }
  const theme = Theme.get()
  setThemeClass(theme)

  if (! select) {
    return () => {}
  }

  select.value = theme

  const handleSelectChange = event => {
    setThemeClass(event.target.value)
  }

  select.addEventListener('change', handleSelectChange)

  return function unbindThemeSelect() {
    select.removeEventListener('change', handleSelectChange)
  }
}
