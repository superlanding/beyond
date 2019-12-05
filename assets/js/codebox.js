(function() {
  class Codebox {

    constructor(dom) {
      this.dom = dom
      this.currentIndex = 0
      this.init()
    }

    removeCurrentClass() {
      if (this.currentIndex !== null) {
        this.tabs[this.currentIndex].classList.remove('js-active')
      }
    }

    init() {
      this.tabs = this.dom.querySelectorAll('[data-tabs] > a')
      this.panesBox = this.dom.querySelector('[data-panes]')
      this.tabs.forEach((a, i) => {
        a._handleTabClick = () => {
          this.removeCurrentClass()
          this.currentIndex = i
          a.classList.add('js-active')
          const x = (i === 0) ? '0' : `-${i * 100}%`
          this.panesBox.style.transform = `translateX(${x})`
        }
        a.addEventListener('click', a._handleTabClick, false)
      })

      const [firstTab] = this.tabs
      if (firstTab) {
        firstTab.classList.add('js-active')
      }
    }
  }
  const doms = document.querySelectorAll('[data-codebox]')
  doms.forEach(dom => {
    const codebox = new Codebox(dom)
  })
})();
