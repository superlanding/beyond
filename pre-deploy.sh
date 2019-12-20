#!/bin/bash
git co github
git merge master --no-ff
yarn build
git add -f _site dist
git commit -m "update _site/ and dist/"
git subtree split --prefix _site -b gh-pages
