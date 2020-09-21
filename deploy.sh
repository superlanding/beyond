#!/bin/bash

date +%s > _data/version.yml
git add _data/version.yml
git commit -m "update version.yml"

git co github
git merge -X --no-ff --no-edit theirs master

yarn build
git add -f _site dist
git commit -m "update _site/ and dist/"
git subtree split --prefix _site -b gh-pages

git push --all origin
git co master
