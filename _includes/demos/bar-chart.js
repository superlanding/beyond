export default function bindBarCharts() {

  const { BarChart } = window.beyond
  const dom = document.getElementById('bar-chart')

  const b = new BarChart(dom)

  b.setData([
    { name: '1 個月內', value: 0.8 },
    { name: '3 個月內', value: 1.7 },
    { name: '6 個月內', value: 1.1 }
  ])

  if (! dom) {
    return () => {}
  }

  return function unbindBarCharts() {
  }
}
