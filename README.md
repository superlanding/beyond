[![Build Status](https://travis-ci.org/superlanding/beyond.svg?branch=master)](https://travis-ci.org/superlanding/beyond)
# Beyond
https://superlanding.github.io/beyond/

## Site Development

```bash
bundle
yarn
foreman start
# http://localhost:4000/
```

## Release to NPM & RubyGems
Make sure the following accounts have been signed-in in terminal
1. npm ( via `npm login` command )
2. gem ( via `gem signin` command )

<br>

1. yarn build; git add .; git cm -m “yarn build”; git push; ( If js files were modified )
2. yarn release ( This will release to npm and rubygems )
3. yarn deploy ( Update github website )

## Site Deployment

```bash
yarn deploy
```

## Site Release

```bash
# Do this in master branch.
# It will build assets,
# publish npm version and deploy to github page.
yarn release
```

## References
 - https://jekyllrb.com/docs/step-by-step/01-setup/
 - https://gist.github.com/tduarte/eac064b4778711b116bb827f8c9bef7b
