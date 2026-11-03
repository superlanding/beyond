[![Test](https://github.com/superlanding/beyond/actions/workflows/test.yml/badge.svg)](https://github.com/superlanding/beyond/actions/workflows/test.yml)
[![Gem Version](https://badge.fury.io/rb/beyond-rails.svg)](https://rubygems.org/gems/beyond-rails)

# Beyond

Beyond 是 Superlanding 後台網站共用的 UI kit：包含 Sass 樣式、JavaScript 元件
（Alert、Dropdown、Datepicker、Modal、Tabbox、Toast、Tooltip、TagInput、圖表等）、字型圖示（font icon）與圖片。
它以兩種形式發佈：

| 套件 | Registry | 適用情境 |
| --- | --- | --- |
| `beyond-rails` | [RubyGems](https://rubygems.org/gems/beyond-rails) | Rails 應用程式（Sprockets / asset pipeline）。另外包含 Rails view helper、form builder 與分頁 renderer（見下方說明）。 |
| `@superlanding/beyond` | [npm](https://www.npmjs.com/package/@superlanding/beyond) | 以 Webpack 建置的前端專案。 |

所有元件的文件與線上 demo：<https://superlanding.github.io/beyond/>

Ruby 的部分（`lib/`）提供：

- **View helper**：`b_alert_box`、`b_icon`、`icon_link_to`、`b_attr`。
- **`beyond_form_for` / `beyond_form_with` / `beyond_form_tag`**：Rails form builder（`BeyondForm::FormBuilder`），
  會產生套用 Beyond 樣式的表單群組、label、說明文字與驗證錯誤訊息。
- **`will_paginate` renderer**：為 [will_paginate](https://github.com/mislav/will_paginate) 提供套用 Beyond 樣式的分頁。

## 環境需求

與 [`.github/workflows/test.yml`](.github/workflows/test.yml) 的 CI 矩陣一致：

| Ruby | Rails |
| --- | --- |
| 3.0 – 3.4 | 7.0、7.1 |
| 3.1 – 3.4 | 7.2 |
| 3.2 – 3.4 | 8.0、8.1 |

- Ruby >= 3.0（`required_ruby_version`）。
- `actionpack` 與 `activemodel` >= 7.0，< 8.2。
- 隨 gem 一併安裝的 runtime 相依套件：`sassc`、`autoprefixer-rails`、`will_paginate`。
- Beyond 2.0.0 起不再支援 Rails 5 與 6。Beyond 1.0.18（含）以前的版本支援 Rails 5/6；如果無法升級，請停留在那些版本。

> **打包注意事項。** `beyond.gemspec` 目前以 `s.files = git ls-files -- src/*` 打包 gem，所以發佈到 RubyGems 的 gem
> （以 1.0.18 檢查）只包含 `src/`（Sass、JS 原始碼、字型、圖片），**不包含**
> `lib/`（Ruby helper、form builder 與 engine）以及編譯後的 `dist/` 檔案。在 gemspec 的檔案清單修改之前，
> 下面介紹的 Ruby helper 只有從 git checkout 載入 gem 時才能使用，例如
> `gem "beyond-rails", github: "superlanding/beyond"`；而 `//= require beyond` 需要編譯後的 `dist/`。

## 安裝

### Rails

```ruby
# Gemfile
gem "beyond-rails"
# 或者，要連 lib/ 與 dist/ 一起取得（見上方打包注意事項）：
# gem "beyond-rails", github: "superlanding/beyond"
```

```js
// app/assets/javascripts/application.js
//= require beyond
```

```scss
// app/assets/stylesheets/application.scss
@import "beyond-sprockets";
@import "beyond";
```

載入 Rails 時，`require "beyond_rails"`（由 Bundler 執行）會註冊 `Beyond::Rails::Engine`，它會把
`src/sass`、`dist`、`src/font` 與 `src/img` 加進 asset path，並把 helper mix 進 `ActionView`。
在 Rails 以外的環境，如果有定義 `Sprockets`，Beyond 會把它的路徑註冊到 Sprockets。

### Webpack

```bash
yarn add @superlanding/beyond --exact
```

```scss
// 字型圖示與 CSS 圖片所在的位置
$beyond-icon-font-path: '~@superlanding/beyond/src/font/';
$beyond-css-img-path: '~@superlanding/beyond/src/sass/img/';

@import '~@superlanding/beyond/src/sass/index.scss';
```

## 使用方式

### JavaScript 元件

不需要設定的元件（Alert、Checkbox、Dropdown、Menu、Navbar、Radio、Sidebar、Tabbox、Tooltip）
會由 `bind()` 自動綁定。請在 document ready 之後呼叫它。

```js
import { bind, unbindAll } from '@superlanding/beyond'

// bind() 會回傳一個 unbind 函式；它只會銷毀該次 bind() 建立的元件
const unbind = bind()

// unbindAll() 會銷毀自 Beyond 載入以來建立的所有元件
unbindAll()
```

在瀏覽器（asset pipeline 建置）中，同樣的 API 放在 `window.beyond`：

```js
const unbind = window.beyond.bind()
window.beyond.unbindAll()
```

其他元件需要手動建立：

```js
import { Datepicker, Dropdown, Modal, Tabbox, Toast, Tooltip } from '@superlanding/beyond'
// 瀏覽器：const { Datepicker, Dropdown, Modal, Tabbox, Toast, Tooltip } = window.beyond
```

各元件的選項與 markup 請參考 demo 網站。

### Rails view helper

`b_alert_box` 會產生 alert。最後一個參數必須是 options hash（即使是空的也不能省略）；
內容是第一個參數或 block。選項：`style`（預設 `:primary`）、`class`、`dismissible`；
其他任何選項都會變成 HTML 屬性。

```erb
<%= b_alert_box("Saved", { style: :success, dismissible: true }) %>
<%= b_alert_box({ style: :danger }) { "Something went wrong" } %>
```

```html
<div class="alert alert-success  alert-dismissible" role="alert" data-alert="true">Saved
  <button type="button" class="close" data-dismiss="alert" aria-label="Close"> … </button>
</div>
<div class="alert alert-danger " role="alert" data-alert="true">Something went wrong</div>
```

`b_icon` 與 `icon_link_to` 會產生字型圖示（`icon-<name>`）：

```erb
<%= b_icon("home") %>                          <%# <i class="icon-home "></i> %>
<%= b_icon("home", "Home", icon: true) %>      <%# <i class="icon-home icon "></i> Home %>
<%= icon_link_to("trash", "Delete", "/x") %>   <%# <a href="/x"><i class="icon-trash icon "></i> Delete</a> %>
```

`b_attr` 會回傳 `{ 'data-controller': controller_name, 'data-action': action_name }`，很適合標在 `<body>` 上，
讓各頁專屬的 JavaScript 找得到目前的 controller 與 action：

```erb
<%= content_tag :body, b_attr do %> … <% end %>
```

### Form builder

`beyond_form_for`、`beyond_form_with` 與 `beyond_form_tag` 會用 `BeyondForm::FormBuilder` 包裝 Rails 的 `form_for`、`form_with` 與 `form_tag` 風格的
表單。每個欄位都會包在 `.form-group` 裡，附帶 label、說明文字與錯誤訊息。

```erb
<%= beyond_form_for @user, as: :user, url: users_path do |f| %>
  <%= f.text_field :name, help: "Shown on invoices" %>
  <%= f.select :role, [["Admin", "admin"], ["Member", "member"]] %>
  <%= f.primary "Save" %>
<% end %>
```

```html
<form class="new_user" id="new_user" role="form" autocomplete="off" action="/users" method="post">
  <div class="form-group">
    <label for="user_name">Name</label>
    <input class="form-control" type="text" value="Bob" name="user[name]" id="user_name" />
    <small class="form-txt txt-muted">Shown on invoices</small>
  </div>
  …
  <input type="submit" name="commit" value="Save" class="btn btn-primary" data-disable-with="Save" />
</form>
```

好用的選項與方法（可執行的範例見 `test/ruby/form_builder_test.rb`）：

- `layout: :horizontal`（搭配 `label_col:` / `control_col:`）或 `layout: :inline`。
- 每個欄位可設定 `label:` 與 `help:`。
- `f.errors_on(:name)` 會輸出單一欄位的錯誤；`f.alert_message("Please fix:")` 會把所有錯誤以 alert 輸出。
- `f.submit`、`f.button`（次要按鈕）與 `f.primary`（主要按鈕；`render_as_button: true` 會輸出 `<button>`）。
- 文字、email、密碼、數字、日期 / 時間、select、collection select、checkbox、radio button、檔案、rich text 等輸入元件
  都放在 `lib/beyond_form/inputs/`。

### 分頁

載入 helper 之後，`will_paginate` 會自動使用 Beyond 的 Bootstrap 風格 renderer
（`<ul class="pagination pagination-sm">`，搭配 `page-item` / `page-link`）。傳入 `remote: true` 會在連結上加 `data-remote`。

```erb
<%= will_paginate @items %>
<%= will_paginate @items, remote: true %>
```

## 開發

文件網站是 Jekyll 網站，搭配 Webpack dev server：

```bash
bundle        # Jekyll（根目錄的 Gemfile 與 .ruby-version 固定使用 Ruby 2.5.5，供文件網站使用）
yarn
foreman start
# http://localhost:4000/
```

原始碼結構：`src/sass`、`src/js`（元件、utils、測試）、`src/font`、`src/img`、`lib/`（Ruby）、`dist/`（編譯後的資源，會提交進 repo）、
`test/ruby`（Ruby 測試），以及 Jekyll 頁面（`components/`、`_includes/`、`_data/`）。

## 測試

JavaScript 測試（ava）：

```bash
yarn test
```

Ruby 測試（minitest）。請用 `gemfiles/` 裡的其中一個 Gemfile 來選擇 Rails 版本：

```bash
BUNDLE_GEMFILE=gemfiles/rails_8.1.gemfile bundle install
BUNDLE_GEMFILE=gemfiles/rails_8.1.gemfile bundle exec rake t
```

CI 會針對每個支援的 Ruby × Rails 組合執行 Ruby 測試。
有兩個測試是刻意跳過的；其中一個用來記錄「`b_alert_box("text")` 沒帶 options hash 時會 raise `NoMethodError`」。

## 發版

### Gem（自動）

1. 在你的 PR 裡修改 `lib/beyond/version.rb` 的 `VERSION`（並讓 `package.json` 的 `version` 保持同步），然後在 [`CHANGELOG.md`](CHANGELOG.md)
   新增新版本的區塊。
2. 合併到 `master`。[`.github/workflows/publish.yml`](.github/workflows/publish.yml) 會執行測試，檢查該版本
   是否已存在於 rubygems.org，若不存在就透過 RubyGems Trusted Publishing 發佈（OIDC；不存放 API key）
   並打上 `vX.Y.Z` tag。沒有跳版號的合併不會發佈任何東西。

### npm 與文件網站（手動）

npm 套件與 GitHub Pages 網站不是由 CI 發佈的。如果 JavaScript 檔案有變動，請先建置
（`yarn build`，並提交 `dist/`），然後在以 `npm login` 登入的狀態下執行：

```bash
yarn release   # 跳 patch 版號、推送 gem、打 tag、發佈到 npm（release.sh）
yarn deploy    # 更新 GitHub Pages 網站
```

`release.sh` 也會自己用 `gem push` 推送 gem，所以只有在你打算手動發佈時才使用它；
否則請依賴上面的自動 gem 發版。

## 貢獻

每個 pull request 在行為、用法、設定或支援版本有變時，都必須更新這份 README，
並且在 [`CHANGELOG.md`](CHANGELOG.md) 新增一筆條目（見 [`CLAUDE.md`](CLAUDE.md)）。

## 參考資料

- https://jekyllrb.com/docs/step-by-step/01-setup/
- https://gist.github.com/tduarte/eac064b4778711b116bb827f8c9bef7b
