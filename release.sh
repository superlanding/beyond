#!/bin/bash

npm whoami > /dev/null

NPM_LOGGED_IN=$?

if [ $NPM_LOGGED_IN -ne 0 ]; then
  npm login
fi

yarn deploy
npm version patch
git push --tags
bash -l -c "npm publish"

CURRENT_HASH=$(git rev-parse HEAD)
git co master
git cherry-pick $CURRENT_HASH
git push origin master
