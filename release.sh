#!/bin/bash

yarn deploy
npm version patch
git push --tags
bash -l -c "npm publish"
