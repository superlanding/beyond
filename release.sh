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
NPM_PATCH_COMMIT=$(git rev-parse HEAD)

VERSION=$(npm run version --silent)
sed -i '' -e "s/VERSION = '\(.*\)'/VERSION = '$VERSION'/" lib/beyond/version.rb

gem build beyond.gemspec

GEM_FILE="beyond-rails-$VERSION.gem"
gem push $GEM_FILE
rm $GEM_FILE

git add lib/beyond/version.rb
git commit -m "Rybygem bump version: $VERSION"

GEM_VERSION_COMMIT=$(git rev-parse HEAD)

git co master
git cherry-pick $NPM_PATCH_COMMIT  --strategy-option theirs
git cherry-pick $GEM_VERSION_COMMIT  --strategy-option theirs
git push --all
