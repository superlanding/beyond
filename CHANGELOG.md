# 更新紀錄（Changelog）

本檔記錄此專案所有值得注意的變更。

格式參考 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本號遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

日期為該版本 gem 發佈到 [rubygems.org](https://rubygems.org/gems/beyond-rails) 的日期。
2.0.0 以前的條目是根據 git 歷史（`vX.Y.Z` tag 與 commit message）回溯整理的；
幾乎每次發版都會附帶的 `dist/` 重新建置與 `version.yml` 跳版號，則不列入。

## [Unreleased]

## [2.0.0] - 2026-10-27

> 還沒有發佈到 rubygems.org。這個區塊的日期是跳版號的 pull request 的日期；
> 請在實際合併並發佈的那天修正成當天日期。
> 1.0.19 從未發佈；它的變更包含在 2.0.0 裡。

### Added
- Rails helper、`beyond_form` form builder 與
  `will_paginate` renderer 的 Ruby 測試（minitest）。以 `bundle exec rake t` 執行。
- GitHub Actions 測試矩陣：Ruby 3.0–3.4 × Rails 7.0–8.1（只跑各 Rails 版本支援的組合），
  每個 Rails 版本各有一個 `gemfiles/rails_X.Y.gemfile`。
- `.github/workflows/publish.yml`：把新的 `lib/beyond/version.rb` 版本號合併到 `master` 後，會透過
  RubyGems Trusted Publishing 自動發佈 gem 到 rubygems.org（不存放 API key）。
- `CLAUDE.md` 加入發版規則，以及維護 `README.md` 與 `CHANGELOG.md` 的規則。
- `CLAUDE.md` 規定 `README.md` 與 `CHANGELOG.md` 一律用繁體中文（zh-TW）撰寫，程式碼、識別字與指令維持英文。
- 重寫 `README.md`：環境需求、安裝、Rails helper / form builder / 分頁的用法、
  開發、測試與發版說明。

### Changed
- **不相容變更：** gem 現在需要 Ruby >= 3.0 與 Rails（`actionpack` / `activemodel`）>= 7.0，< 8.2
  （先前是 `>= 5.0, < 7.0`）。如果仍在使用 Rails 5/6，請停留在 1.0.18。
- `README.md`、`CHANGELOG.md` 改以繁體中文（zh-TW）撰寫。

### Removed
- **不相容變更：** 移除 Rails 5 與 Rails 6 支援。`beyond_form` 裡只用來保護
  Rails 5 的 `Rails::VERSION` 檢查（`actiontext` helper 的 require 與 `RichTextArea` input）已移除；這兩者現在一律載入。

### Fixed
- Ruby 3 相容性：以 `Integer` 取代 `Fixnum`；`beyond_form_with` 現在改呼叫 `form_with(**options)`。

## [1.0.18] - 2022-06-15

### Added
- `skipSuggest` 選項（JS）。
- Sass 變數 `control-hint-color`。

## [1.0.17] - 2022-06-15

### Changed
- 更新 browserslist / caniuse 資料庫並重新建置 `dist/`。

## [1.0.16] - 2022-06-15

### Added
- `TagInput` 的 `blur` 事件。

## [1.0.15] - 2022-05-04

### Fixed
- 表單控制項的 active 樣式。

## [1.0.14] - 2022-04-01

### Added
- `TagInput` 的 `options.inputId`。

## [1.0.13] - 2022-04-01

### Added
- `validate` 方法支援 `res.text`。

## [1.0.12] - 2022-03-04

### Changed
- 重新建置 `dist/`（自 1.0.11 以來沒有原始碼變更）。

## [1.0.11] - 2022-03-04

### Fixed
- `moveTo` 現在會處理 Dropdown 選項的值。

## [1.0.10] - 2022-03-04

### Fixed
- 現在會擋掉空的 `optionEl`。

## [1.0.9] - 2022-03-04

### Fixed
- 空的 `optionEl` 的處理。

## [1.0.8] - 2022-03-04

### Changed
- `button` tag 不再包含在 `btns` 與 `dropdownBtns` 的 selector 裡。
- 新增 `.ruby-version`。

### Fixed
- `tabbox` 樣式。

## [1.0.7] - 2022-01-04

### Fixed
- 行內（inline）checkbox 樣式。

## [1.0.6] - 2022-01-03

### Added
- Sass 變數 `txt-active`。

## [1.0.5] - 2021-12-28

### Added
- 深色主題用的 `bg-warn` 與 `bg-danger` 變數。

### Fixed
- `Theme.js`。

## [1.0.4] - 2021-12-24

### Added
- 深色主題（`THEME_DARK`、`setTheme` / `setBg`），包含 `LineChart`、`BarChart` 與 `PieChart` 的主題支援。
- Sass 變數 `sidebar-bg`。

### Changed
- 重構按鈕、badge 與 toast 的樣式變數。

### Fixed
- 深色主題下的 autocomplete 樣式。

## [1.0.3] - 2021-12-02

### Fixed
- 找到項目時，點擊項目現在會呼叫 `preventDefault` 與 `stopPropagation`。
- Alert demo。

### Changed
- 更新 caniuse-lite。

## [1.0.2] - 2021-11-02

### Added
- `Dropdown` 的 `options.hidden`。

## [1.0.1] - 2021-08-10

1.0 改版設計的第一個發佈版本（`version.yml` 裡跳到 "1.0.0" 的版本號從未發佈成 gem）。

### Added
- `avatar-letter`。

### Changed
- 更新圖示集。
- 重新設計按鈕、dropdown、mega menu 與 tooltip 的樣式；`alert-warning` 現在改為 `alert-warn`。
- 更新 `txt-muted` 的顏色。

### Removed
- 按鈕類型 `success`、`warning`、`info`、`light`、`dark`、`type1` 與 `type2`，以及 `.btn-outline` / `.outlined`。
- Alert 類型 `success`、`info`、`light` 與 `dark`。
- `avatar-types`（由 `avatar-letter` 取代）。
- Popover 樣式與 demo。

## [0.0.139 – 0.0.295] - 2020-04-22 – 2021-07-15

1.0 以前的 145 個版本（2020-04-22 的 0.0.139 到 2021-07-15 的 0.0.295）發佈時都沒有附 release note。
各版本的變更請參考 git 裡的 `v0.0.x` tag。

[Unreleased]: https://github.com/superlanding/beyond/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/superlanding/beyond/compare/v1.0.18...HEAD
[1.0.18]: https://github.com/superlanding/beyond/compare/v1.0.17...v1.0.18
[1.0.17]: https://github.com/superlanding/beyond/compare/v1.0.16...v1.0.17
[1.0.16]: https://github.com/superlanding/beyond/compare/v1.0.15...v1.0.16
[1.0.15]: https://github.com/superlanding/beyond/compare/v1.0.14...v1.0.15
[1.0.14]: https://github.com/superlanding/beyond/compare/v1.0.13...v1.0.14
[1.0.13]: https://github.com/superlanding/beyond/compare/v1.0.12...v1.0.13
[1.0.12]: https://github.com/superlanding/beyond/compare/v1.0.11...v1.0.12
[1.0.11]: https://github.com/superlanding/beyond/compare/v1.0.10...v1.0.11
[1.0.10]: https://github.com/superlanding/beyond/compare/v1.0.9...v1.0.10
[1.0.9]: https://github.com/superlanding/beyond/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/superlanding/beyond/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/superlanding/beyond/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/superlanding/beyond/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/superlanding/beyond/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/superlanding/beyond/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/superlanding/beyond/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/superlanding/beyond/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/superlanding/beyond/compare/v0.0.295...v1.0.1
