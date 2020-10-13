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
在發布之前要確認已在 terminal 登入以下帳號
Make sure the following accounts have been signed-in in terminal
1. npm ( via `npm login` command )
2. gem ( via `gem signin` command )


1. yarn build; git add .; git cm -m “yarn build”; git push;
2. yarn release
3. yarn deploy

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
