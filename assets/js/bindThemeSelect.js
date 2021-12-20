export default function bindThemeSelect() {

  const select = document.getElementById('theme-select')

  if (! select) {
    return () => {}
  }

  const setThemeClass = theme => {
    const { classList } = document.body
    classList.forEach(classname => {
      if (classname.startsWith('theme-')) {
        classList.remove(classname)
      }
    })
    classList.add(`theme-${theme}`)
  }

  let theme = select.value

  setThemeClass(theme)

  const handleSelectChange = event => {
    theme = event.target.value
    setThemeClass(theme)
  }

  select.addEventListener('change', handleSelectChange)

  return function unbindThemeSelect() {
    select.removeEventListener('change', handleSelectChange)
  }
}
