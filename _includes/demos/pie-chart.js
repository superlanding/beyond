import toPixel from '@superlanding/topixel'

export default function bindPieCharts() {

  const { PieChart } = window.beyond
  const dom = document.getElementById('pie-chart')

  if (! dom) {
    return () => {}
  }

  const chartMenu = document.getElementById('chart-menu')
  const b = new PieChart(dom, {
    onPieMouseOver(mousePos, res) {
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
