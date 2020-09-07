import throttle from 'lodash.throttle'

export default function bindBarCharts() {

  const { BarChart } = window.beyond
  const dom = document.getElementById('bar-chart')

  if (! dom) {
    return () => {}
  }

  const b = new BarChart(dom)

  b.setData([
    { name: '1 個月內', value: 0.8 },
    { name: '3 個月內', value: 1.7 },
    { name: '6 個月內', value: 1.1 }
  ])

  let domWidth = dom.offsetWidth

  const handleResize = throttle(() => {
    if (dom.offsetWidth !== domWidth) {
      b.refresh()
    }
    domWidth = dom.offsetWidth
  }, 300)
  window.addEventListener('resize', handleResize)

  return function unbindBarCharts() {
    window.removeEventListener('resize', handleResize)
    b.destroy()
  }
}
