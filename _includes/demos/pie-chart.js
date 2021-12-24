import toPixel from '@superlanding/topixel'
import Theme from '../../assets/js/models/Theme'

export default function bindPieCharts() {

  const { PieChart } = window.beyond
  const dom = document.getElementById('pie-chart')

  if (! dom) {
    return () => {}
  }

  const onMouseOver = (mousePos, res) => {
    if (res) {
      chartMenu.innerHTML = `
        <div>${res.label}: ${res.value}</div>
      `
      chartMenu.style.left = toPixel(mousePos.x)
      chartMenu.style.top = toPixel(mousePos.y + 20)
      chartMenu.style.display = 'block'
    }
    else {
      chartMenu.style.display = 'none'
    }
  }

  const chartMenu = document.getElementById('chart-menu')
  const theme = Theme.get()
  const b = new PieChart(dom, {
    theme,
    onPieMouseOver: onMouseOver,
    onLabelMouseOver: onMouseOver
  })

  b.setData([
    { label: '1 個月內', value: 20 },
    { label: '3 個月內', value: 50 },
    { label: '6 個月內', value: 30 }
  ])

  return function unbindPieCharts() {
    b.destroy()
  }
}
