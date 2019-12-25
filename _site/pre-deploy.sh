#!/bin/bash

git co master
yarn build
git add dist
git commit -m "update dist/"

git co github
git merge master --no-ff

git add -f _site
git commit -m "update _site/"
git subtree split --prefix _site -b gh-pages
