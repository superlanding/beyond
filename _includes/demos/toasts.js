const names = ['路人甲', '路人乙', '路人丙']
const actions = ['吃了一個漢堡', '跌了一跤', '說: 你當台灣人是塑膠做的喔 ! 不要欺負我們台灣人']

const { Toast } = window.beyond
const toast = new Toast()
const btn = document.getElementById('btn-toast')

let clickedCount = 0

btn.addEventListener('click', () => {

  const num = parseInt(Math.random() * 10, 10) + 1
  const index = num % names.length

  toast.send({
    message: `${++clickedCount}. ${names[index]}${actions[index]}`,
    btnText: '取消',
    btnCb(res) {
      res.clear()
    }
  })
}, false)
