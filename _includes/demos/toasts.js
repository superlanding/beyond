import noop from 'lodash.noop'

export default function bindToasts() {
  const btn = document.getElementById('btn-toast')

  if (! btn ) {
    return noop
  }
  const names = ['路人甲', '路人乙', '路人丙']
  const actions = ['吃了一個漢堡', '跌了一跤', '說: 你當台灣人是塑膠做的喔 ! 不要欺負我們台灣人']
  const { Toast } = window.beyond
  const toast = new Toast()

  let clickedCount = 0

  const handleBtnClick = () => {
    const num = parseInt(Math.random() * 10, 10) + 1
    const index = num % names.length

    toast.send({
      message: `${++clickedCount}. ${names[index]}${actions[index]}`,
      btnText: '取消',
      btnCb(res) {
        res.clear()
      }
    })
  }

  btn.addEventListener('click', handleBtnClick)

  return function unbindToasts() {
    toast.destroy()
    btn && btn.removeEventListener('click', handleBtnClick)
  }
}
