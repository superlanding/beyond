#!/bin/bash

yarn deploy
npm version patch
git push --tags
bash -l -c "npm publish"

CURRENT_HASH=$(git rev-parse HEAD)
git co master
git cherry-pick $CURRENT_HASH
