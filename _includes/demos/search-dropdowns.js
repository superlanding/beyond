(function() {
  const { SearchDropdown } = window.beyond

  const rows = [
    { prefix: 'SP', title: '🔥SHARE.CO🔥經典香水吊卡 ➜ 糖果茉莉, 奇蹟罌粟, 能量麝香, 甜蜜莉莉' },
    { prefix: 'SPY', title: '🔥SHARE.CO🔥經典粉絲限定 VIP 方案' },
    { prefix: 'SW', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW1', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW2', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW3', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW4', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW5', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW6', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW7', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW8', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW9', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW10', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW11', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW12', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW13', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' },
    { prefix: 'SW14', title: '素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計' }
  ]

  document.querySelectorAll('[data-search-dropdown]')
    .forEach(dom => {
      new SearchDropdown(dom, {
        placeholder: '搜尋',
        renderItem(row, i, selected) {
          return `
            <div class="search-dropdown-menu-item ${selected ? 'selected' : ''}"
                 data-item>
              <strong>${row.prefix}</strong>
              <span>${row.title}</span>
            </div>
            `
        },
        async getData(keyword) {
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
    })
})()
