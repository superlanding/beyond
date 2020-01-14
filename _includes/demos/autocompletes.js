(function() {
  const { Autocomplete } = window.beyond

  const rows = [
    { prefix: 'SP', title: '🔥SHARE.CO🔥經典香水吊卡 ➜ 糖果茉莉, 奇蹟罌粟, 能量麝香, 甜蜜莉莉' },
    { prefix: 'SPY', title: '🔥SHARE.CO🔥經典粉絲限定 VIP 方案' },
    { prefix: 'SW', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' }
  ]

  const dom = document.querySelector('[data-autocomplete]')

  if (! dom) {
    return
  }

  new Autocomplete(dom, {

    async getData({ keyword }) {
      return rows.filter(({ prefix, title }) => {

        const upperKeyword = keyword.toUpperCase()
        const upperTitle = title.toUpperCase()
        const upperPrefix = prefix.toUpperCase()

        return upperPrefix.includes(upperKeyword) || upperTitle.includes(upperKeyword)
      })
    },
    itemClick(row) {
      return row.prefix
    }
  })
})()
