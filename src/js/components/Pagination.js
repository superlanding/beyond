import supportDom from '../decorators/supportDom'
import { range, noop, toInt } from '../utils'
import { $, $$ } from '../utils/dom'

const ACTIVE_CLASSNAME = 'js-active'
const DOTS = '⸱⸱⸱'

@supportDom
export default class Pagination {

  constructor(config) {

    this.dom = config.dom
    this.page = config.page || 1
    this.total = config.total || 0
    this.maxVisiblePage = config.maxVisiblePage || 7
    this.currentPageNode = null
    this.change = config.change || noop

    this.init()
    this.addEvents()
  }

  init() {
    const { dom } = this
    this.ul = $('[data-pagination]', dom)
    this.prevBtn = $('[data-prev]', dom)
    this.nextBtn = $('[data-next]', dom)
    this.input = $('[data-page-input]', dom)
    this.drawPages()
  }

  clearPages() {
    const { ul } = this
    $$('[data-page-item]', ul)
      .concat($$('[data-page-dots]', ul))
      .map(item => item.parentNode)
      .forEach(item => item.remove())
  }

  getLiNode(pageOrDots) {

    const li = document.createElement('li')
    li.className = 'page-item'
    const anchor = document.createElement('a')
    anchor.className = 'page-link'

    if (pageOrDots === DOTS) {
      anchor.setAttribute('data-page-dots', '')
      anchor.textContent = DOTS
    }
    else {
      const page = pageOrDots
      anchor.setAttribute('data-page-item', page)
      anchor.textContent = page
    }

    li.appendChild(anchor)
    return li
  }

  setActive(page) {

    const { currentPageNode } = this

    if (currentPageNode) {
      currentPageNode.classList.remove(ACTIVE_CLASSNAME)
    }

    const anchor = $(`[data-page-item="${page}"]`)

    if (! anchor) {
      return
    }
    anchor.classList.add(ACTIVE_CLASSNAME)
    this.currentPageNode = anchor
    this.page = page
  }

  insertPageLi(li) {
    this.ul.insertBefore(li, this.nextBtn.parentNode)
  }

  hideInput() {
    this.input.parentNode.style.display = 'none'
  }

  showInput() {
    this.input.parentNode.style.display = 'flex'
  }

  drawRegularPages(currentPage = this.page) {

    this.hideInput()

    range(1, this.total + 1)
      .forEach(page => {
        const li = this.getLiNode(page)
        this.insertPageLi(li)
      })
    this.setActive(currentPage)
  }

  drawPagesWithInput(page = this.page) {

    this.clearPages()

    this.showInput()

    const { total } = this
    const beforeLast = total - 1

    const isFirst = (page === 1)
    const isSecond = (page === 2)
    const isBeforeLast = (page === beforeLast)
    const isLast = (page === total)

    // Consider the five cases below:
    // [1] 2  ...  9  10
    //  1 [2]  3  ... 10
    //  1 ... [5] ... 10
    //  1 ...  8  [9] 10
    //  1  2  ...  9 [10]
    const firstLi = this.getLiNode(1)
    this.insertPageLi(firstLi)

    const secondText = ((page <= 3) || isLast) ? 2 : DOTS
    const secondLi = this.getLiNode(secondText)
    this.insertPageLi(secondLi)

    const thirdText = (function(p) {
      if (isFirst || isLast) {
        return DOTS
      }
      if (isSecond) {
        return 3
      }
      if (isBeforeLast) {
        return beforeLast - 1
      }
      return p
    })(page)

    const thirdLi = this.getLiNode(thirdText)
    this.insertPageLi(thirdLi)

    const fourthText = (function(p) {
      if (isFirst || isBeforeLast || isLast) {
        return beforeLast
      }
      if (p === (beforeLast - 1)) {
        return beforeLast
      }
      return DOTS
    })(page)

    const fourthLi = this.getLiNode(fourthText)
    this.insertPageLi(fourthLi)

    const lastLi = this.getLiNode(total)
    this.insertPageLi(lastLi)

    this.setActive(page)
  }

  isInputView() {
    const { total } = this
    return ((total > this.maxVisiblePage) && (total > 5))
  }

  drawPages() {

    this.clearPages()

    if (this.isInputView()) {
      this.drawPagesWithInput()
    }
    else {
      this.drawRegularPages()
    }
  }

  isPrevBtn(target) {
    return ('prev' in target.dataset)
  }

  isNextBtn(target) {
    return ('next' in target.dataset)
  }

  isPageBtn(target) {
    return ('pageItem' in target.dataset)
  }

  isDotBtn(target) {
    return ('pageDots' in target.dataset)
  }

  handlePageClick(target) {
    const page = toInt(target.dataset.pageItem)
    if (page === this.page) {
      return
    }
    this.setActive(page)
    this.change(page)
  }

  handleDotBtnClick() {
    this.input.focus()
  }

  setActiveAndChangeInputViewIfNeeded(page) {
    if (this.isInputView()) {
      return this.drawPagesWithInput(page)
    }
    this.setActive(page)
  }

  isValidPage(page) {
    return (! isNaN(page)) && (page >= 1) && (page <= this.total)
  }

  setInputDanger() {
    this.input.classList.add('is-invalid')
  }

  setInputNormal() {
    this.input.classList.remove('is-invalid')
  }

  addEvents() {
    this.addEvent(this.ul, 'click', event => {

      let { target } = event
      if (target.tagName === 'I') {
        target = target.parentNode
      }

      const { page } = this

      if (this.isNextBtn(target) && (page < this.total)) {
        const nextPage = page + 1
        this.setActiveAndChangeInputViewIfNeeded(nextPage)
        this.change(nextPage)
      }
      else if (this.isPageBtn(target)) {
        this.handlePageClick(target)
      }
      else if (this.isPrevBtn(target) && (page > 1)) {
        const prevPage = page - 1
        this.setActiveAndChangeInputViewIfNeeded(prevPage)
        this.change(prevPage)
      }
      else if (this.isDotBtn(target)) {
        this.handleDotBtnClick()
      }
    })

    this.addEvent(this.input, 'change', event => {
      const page = toInt(event.target.value)

      if (! this.isValidPage(page)) {
        return this.setInputDanger()
      }
      this.setInputNormal()
      this.setActiveAndChangeInputViewIfNeeded(page)
    })
  }

  destroy() {
    this.clearPages()
  }
}
