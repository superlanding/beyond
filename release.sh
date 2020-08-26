#!/bin/bash

set -x

npm whoami > /dev/null

NPM_LOGGED_IN=$?

if [ $NPM_LOGGED_IN -ne 0 ]; then
  npm login
fi

npm version --no-git-tag-version patch

VERSION=$(npm run version --silent)
sed -i '' -e "s/VERSION = '\(.*\)'/VERSION = '$VERSION'/" lib/beyond/version.rb

git add package.json
git add lib/beyond/version.rb
git commit -m $VERSION

gem build beyond.gemspec

GEM_FILE="beyond-rails-$VERSION.gem"
gem push $GEM_FILE
rm $GEM_FILE

git tag "v$VERSION"
git push --tags
bash -l -c "npm publish"

git push --all
