# Beyond

## Development

```bash
bundle
yarn
foreman start
# http://localhost:4000/
```

## Deployment

```bash
git co github
git merge master --no-ff
yarn build
git add -f _site
git subtree split --prefix _site -b gh-pages
git co gh-pages
git push -f origin gh-pages
```

## References
 - https://jekyllrb.com/docs/step-by-step/01-setup/
 - https://gist.github.com/tduarte/eac064b4778711b116bb827f8c9bef7b
