# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Release dates are the dates the gem was published on [rubygems.org](https://rubygems.org/gems/beyond-rails).
Entries before 2.0.0 were reconstructed from the git history (`vX.Y.Z` tags and commit messages);
the `dist/` rebuilds and `version.yml` bumps that accompany almost every release are omitted.

## [Unreleased]

## [2.0.0] - 2026-10-27

> Not on rubygems.org yet. This section is dated by the pull request that bumps the version;
> adjust the date to the day it is actually merged and published.
> 1.0.19 was never published; its changes are part of 2.0.0.

### Added
- Ruby test suite (minitest) for the Rails helpers, the `beyond_form` form builder and the
  `will_paginate` renderers. Run it with `bundle exec rake t`.
- GitHub Actions test matrix: Ruby 3.0–3.4 × Rails 7.0–8.1 (only the combinations each Rails version supports),
  with one `gemfiles/rails_X.Y.gemfile` per Rails version.
- `.github/workflows/publish.yml`: merging a new `lib/beyond/version.rb` version to `master` publishes the gem
  to rubygems.org automatically through RubyGems Trusted Publishing (no API key stored).
- `CLAUDE.md` rules for releasing and for keeping `README.md` and `CHANGELOG.md` up to date.
- `README.md` rewritten: requirements, installation, usage of the Rails helpers, form builder and pagination,
  development, testing and release instructions.

### Changed
- **Breaking:** the gem now requires Ruby >= 3.0 and Rails (`actionpack` / `activemodel`) >= 7.0, < 8.2
  (previously `>= 5.0, < 7.0`). Stay on 1.0.18 if you are still on Rails 5/6.

### Removed
- **Breaking:** Rails 5 and Rails 6 support. The `Rails::VERSION` checks in `beyond_form` that only guarded
  Rails 5 (the `actiontext` helper require and the `RichTextArea` input) are gone; both are now always loaded.

### Fixed
- Ruby 3 compatibility: `Fixnum` replaced by `Integer`; `beyond_form_with` now calls `form_with(**options)`.

## [1.0.18] - 2022-06-15

### Added
- `skipSuggest` option (JS).
- Sass variable `control-hint-color`.

## [1.0.17] - 2022-06-15

### Changed
- Updated the browserslist / caniuse database and rebuilt `dist/`.

## [1.0.16] - 2022-06-15

### Added
- `blur` event for `TagInput`.

## [1.0.15] - 2022-05-04

### Fixed
- Active style of form controls.

## [1.0.14] - 2022-04-01

### Added
- `options.inputId` for `TagInput`.

## [1.0.13] - 2022-04-01

### Added
- `res.text` support in the `validate` method.

## [1.0.12] - 2022-03-04

### Changed
- Rebuilt `dist/` (no source changes since 1.0.11).

## [1.0.11] - 2022-03-04

### Fixed
- Dropdown option value is now handled in `moveTo`.

## [1.0.10] - 2022-03-04

### Fixed
- Empty `optionEl` is now blocked.

## [1.0.9] - 2022-03-04

### Fixed
- Empty `optionEl` handling.

## [1.0.8] - 2022-03-04

### Changed
- The `button` tag is no longer part of the selectors of `btns` and `dropdownBtns`.
- Added `.ruby-version`.

### Fixed
- `tabbox` style.

## [1.0.7] - 2022-01-04

### Fixed
- Inline checkbox style.

## [1.0.6] - 2022-01-03

### Added
- Sass variable `txt-active`.

## [1.0.5] - 2021-12-28

### Added
- `bg-warn` and `bg-danger` variables for the dark theme.

### Fixed
- `Theme.js`.

## [1.0.4] - 2021-12-24

### Added
- Dark theme (`THEME_DARK`, `setTheme` / `setBg`), including theme support for `LineChart`, `BarChart` and `PieChart`.
- Sass variable `sidebar-bg`.

### Changed
- Refactored the button, badge and toast style variables.

### Fixed
- Autocomplete style in the dark theme.

## [1.0.3] - 2021-12-02

### Fixed
- Clicking an item now calls `preventDefault` and `stopPropagation` when the item is found.
- Alert demos.

### Changed
- Updated caniuse-lite.

## [1.0.2] - 2021-11-02

### Added
- `options.hidden` for `Dropdown`.

## [1.0.1] - 2021-08-10

First release of the 1.0 design refresh (the version bump to "1.0.0" in `version.yml` was never published as a gem).

### Added
- `avatar-letter`.

### Changed
- Updated the icon set.
- Restyled buttons, dropdowns, mega menu and tooltips; `alert-warning` is now `alert-warn`.
- Updated the `txt-muted` color.

### Removed
- Button types `success`, `warning`, `info`, `light`, `dark`, `type1` and `type2`, plus `.btn-outline` / `.outlined`.
- Alert types `success`, `info`, `light` and `dark`.
- `avatar-types` (replaced by `avatar-letter`).
- Popover style and demo.

## [0.0.139 – 0.0.295] - 2020-04-22 – 2021-07-15

145 pre-1.0 releases (0.0.139 on 2020-04-22 up to 0.0.295 on 2021-07-15) were published without release notes.
See the `v0.0.x` tags in git for the individual changes.

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
