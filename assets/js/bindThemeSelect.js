export default function bindThemeSelect() {

  const cacheKey = 'beyond-official::theme'
  const select = document.getElementById('theme-select')

  const setThemeClass = theme => {
    const { classList } = document.body
    classList.forEach(classname => {
      if (classname.startsWith('theme-')) {
        classList.remove(classname)
      }
    })
    classList.add(`theme-${theme}`)
    localStorage.setItem(cacheKey, theme)
  }
  const getInitialTheme = () => localStorage.getItem(cacheKey) || 'default'
  const theme = getInitialTheme()
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
