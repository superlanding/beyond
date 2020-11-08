import throttle from 'lodash.throttle'
import toPixel from '@superlanding/topixel'

export default function bindPieCharts() {

  const { PieChart } = window.beyond
  const dom = document.getElementById('pie-chart')

  if (! dom) {
    return () => {}
  }

  const b = new PieChart(dom, {
    onPieMouseOver(mousePos, res) {
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
