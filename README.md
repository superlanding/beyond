[![Test](https://github.com/superlanding/beyond/actions/workflows/test.yml/badge.svg)](https://github.com/superlanding/beyond/actions/workflows/test.yml)
[![Gem Version](https://badge.fury.io/rb/beyond-rails.svg)](https://rubygems.org/gems/beyond-rails)

# Beyond

Beyond is Superlanding's shared UI kit for admin sites: Sass styles, JavaScript components
(Alert, Dropdown, Datepicker, Modal, Tabbox, Toast, Tooltip, TagInput, charts, …), font icons and images.
It is shipped in two forms:

| Package | Registry | Use it for |
| --- | --- | --- |
| `beyond-rails` | [RubyGems](https://rubygems.org/gems/beyond-rails) | Rails apps (Sprockets / asset pipeline). Also contains Rails view helpers, a form builder and pagination renderers (see the note below). |
| `@superlanding/beyond` | [npm](https://www.npmjs.com/package/@superlanding/beyond) | Webpack-based front ends. |

Documentation and live demos of every component: <https://superlanding.github.io/beyond/>

The Ruby part (`lib/`) provides:

- **View helpers**: `b_alert_box`, `b_icon`, `icon_link_to`, `b_attr`.
- **`beyond_form_for` / `beyond_form_with` / `beyond_form_tag`**: a Rails form builder (`BeyondForm::FormBuilder`) that renders
  Beyond-styled form groups, labels, help text and validation errors.
- **`will_paginate` renderers**: Beyond-styled pagination for [will_paginate](https://github.com/mislav/will_paginate).

## Requirements

Same as the CI matrix in [`.github/workflows/test.yml`](.github/workflows/test.yml):

| Ruby | Rails |
| --- | --- |
| 3.0 – 3.4 | 7.0, 7.1 |
| 3.1 – 3.4 | 7.2 |
| 3.2 – 3.4 | 8.0, 8.1 |

- Ruby >= 3.0 (`required_ruby_version`).
- `actionpack` and `activemodel` >= 7.0, < 8.2.
- Runtime dependencies installed with the gem: `sassc`, `autoprefixer-rails`, `will_paginate`.
- Beyond 2.0.0 dropped Rails 5 and 6 support. Beyond 1.0.18 and earlier support Rails 5/6; stay on those versions if you cannot upgrade.

> **Packaging note.** `beyond.gemspec` currently builds the gem with `s.files = git ls-files -- src/*`, so the gem published
> on RubyGems (checked on 1.0.18) contains only `src/` (Sass, JS sources, fonts, images). It does **not** contain
> `lib/` (the Ruby helpers, form builder and engine) or the compiled `dist/` files. Until the gemspec file list is changed,
> the Ruby helpers described below are only available when the gem is loaded from a git checkout, e.g.
> `gem "beyond-rails", github: "superlanding/beyond"`, and `//= require beyond` needs the compiled `dist/`.

## Installation

### Rails

```ruby
# Gemfile
gem "beyond-rails"
# or, to get lib/ and dist/ as well (see the packaging note above):
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

When Rails is loaded, `require "beyond_rails"` (done by Bundler) registers `Beyond::Rails::Engine`, which adds
`src/sass`, `dist`, `src/font` and `src/img` to the asset paths and mixes the helpers into `ActionView`.
Outside Rails, Beyond registers its paths with Sprockets if `Sprockets` is defined.

### Webpack

```bash
yarn add @superlanding/beyond --exact
```

```scss
// Where the font icons and the CSS images live
$beyond-icon-font-path: '~@superlanding/beyond/src/font/';
$beyond-css-img-path: '~@superlanding/beyond/src/sass/img/';

@import '~@superlanding/beyond/src/sass/index.scss';
```

## Usage

### JavaScript components

Components that need no configuration (Alert, Checkbox, Dropdown, Menu, Navbar, Radio, Sidebar, Tabbox, Tooltip)
are bound automatically with `bind()`. Call it after the document is ready.

```js
import { bind, unbindAll } from '@superlanding/beyond'

// bind() returns an unbind function; it only destroys components created by that bind() call
const unbind = bind()

// unbindAll() destroys every component created since Beyond was loaded
unbindAll()
```

In the browser (asset pipeline build) the same API lives on `window.beyond`:

```js
const unbind = window.beyond.bind()
window.beyond.unbindAll()
```

Other components are created manually:

```js
import { Datepicker, Dropdown, Modal, Tabbox, Toast, Tooltip } from '@superlanding/beyond'
// browser: const { Datepicker, Dropdown, Modal, Tabbox, Toast, Tooltip } = window.beyond
```

See the demo site for each component's options and markup.

### Rails view helpers

`b_alert_box` renders an alert. The last argument must be an options hash (it cannot be omitted, even when empty);
the body is either the first argument or the block. Options: `style` (default `:primary`), `class`, `dismissible`;
any other option becomes an HTML attribute.

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

`b_icon` and `icon_link_to` render font icons (`icon-<name>`):

```erb
<%= b_icon("home") %>                          <%# <i class="icon-home "></i> %>
<%= b_icon("home", "Home", icon: true) %>      <%# <i class="icon-home icon "></i> Home %>
<%= icon_link_to("trash", "Delete", "/x") %>   <%# <a href="/x"><i class="icon-trash icon "></i> Delete</a> %>
```

`b_attr` returns `{ 'data-controller': controller_name, 'data-action': action_name }`, handy for tagging `<body>`
so page-specific JavaScript can find the current controller and action:

```erb
<%= content_tag :body, b_attr do %> … <% end %>
```

### Form builder

`beyond_form_for`, `beyond_form_with` and `beyond_form_tag` wrap Rails' `form_for`, `form_with` and `form_tag`-style
forms with `BeyondForm::FormBuilder`. Every field is wrapped in a `.form-group` with a label, help text and error messages.

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

Useful options and methods (see `test/ruby/form_builder_test.rb` for runnable examples):

- `layout: :horizontal` (with `label_col:` / `control_col:`) or `layout: :inline`.
- `label:` and `help:` per field.
- `f.errors_on(:name)` renders one field's errors; `f.alert_message("Please fix:")` renders all errors as an alert.
- `f.submit`, `f.button` (secondary) and `f.primary` (primary; `render_as_button: true` renders a `<button>`).
- Inputs for text, email, password, number, date/time, select, collection select, check boxes, radio buttons, file, rich text and more
  live in `lib/beyond_form/inputs/`.

### Pagination

Once the helpers are loaded, `will_paginate` uses Beyond's Bootstrap-style renderer automatically
(`<ul class="pagination pagination-sm">` with `page-item` / `page-link`). Pass `remote: true` to add `data-remote` to the links.

```erb
<%= will_paginate @items %>
<%= will_paginate @items, remote: true %>
```

## Development

The documentation site is a Jekyll site with a Webpack dev server:

```bash
bundle        # Jekyll (the root Gemfile and .ruby-version pin Ruby 2.5.5, used by the docs site)
yarn
foreman start
# http://localhost:4000/
```

Source layout: `src/sass`, `src/js` (components, utils, tests), `src/font`, `src/img`, `lib/` (Ruby), `dist/` (compiled assets, committed),
`test/ruby` (Ruby tests), and the Jekyll pages (`components/`, `_includes/`, `_data/`).

## Testing

JavaScript tests (ava):

```bash
yarn test
```

Ruby tests (minitest). Use one of the Gemfiles in `gemfiles/` to pick the Rails version:

```bash
BUNDLE_GEMFILE=gemfiles/rails_8.1.gemfile bundle install
BUNDLE_GEMFILE=gemfiles/rails_8.1.gemfile bundle exec rake t
```

CI runs the Ruby suite for every supported Ruby × Rails combination.
Two tests are skipped on purpose; one documents that `b_alert_box("text")` without an options hash raises `NoMethodError`.

## Releasing

### Gem (automatic)

1. In your PR, bump `VERSION` in `lib/beyond/version.rb` (and keep `package.json` `version` in sync) and add a section
   for the new version to [`CHANGELOG.md`](CHANGELOG.md).
2. Merge to `master`. [`.github/workflows/publish.yml`](.github/workflows/publish.yml) runs the specs, checks whether that version
   already exists on rubygems.org and, if not, publishes it with RubyGems Trusted Publishing (OIDC; no API key is stored)
   and tags `vX.Y.Z`. A merge without a version bump does not publish anything.

### npm and the docs site (manual)

The npm package and the GitHub Pages site are not published by CI. If JavaScript files changed, build first
(`yarn build`, commit `dist/`), then, signed in with `npm login`:

```bash
yarn release   # bumps the patch version, pushes the gem, tags, publishes to npm (release.sh)
yarn deploy    # updates the GitHub Pages site
```

`release.sh` also pushes the gem itself with `gem push`, so use it only when you intend to publish by hand;
otherwise rely on the automatic gem release above.

## Contributing

Every pull request must update this README when behaviour, usage, configuration or supported versions change,
and must add an entry to [`CHANGELOG.md`](CHANGELOG.md) (see [`CLAUDE.md`](CLAUDE.md)).

## References

- https://jekyllrb.com/docs/step-by-step/01-setup/
- https://gist.github.com/tduarte/eac064b4778711b116bb827f8c9bef7b
