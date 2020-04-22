#!/bin/bash

npm whoami > /dev/null

NPM_LOGGED_IN=$?

if [ $NPM_LOGGED_IN -ne 0 ]; then
  npm login
fi

yarn deploy
# NPM release
NEXT_VERSION=$(npm version patch | sed -e 's/v/''/g')
# Ruby Gem release
ruby -e "version_file = File.read('lib/beyond/version.rb'); content = version_file.gsub(/VERSION\ =\ '([0-9\.]+)'.freeze/, \"VERSION = '${NEXT_VERSION}'.freeze\"); File.write('lib/beyond/version.rb', content)"
git add lib/beyond/version.rb
git commit -m "Rybygem bump version: ${NEXT_VERSION}"
gem build beyond.gemspec
gem push beyond-rails-$NEXT_VERSION.gem
rm beyond-rails-$NEXT_VERSION.gem

git push --tags
bash -l -c "npm publish"



CURRENT_HASH=$(git rev-parse HEAD)
git co master
git cherry-pick $CURRENT_HASH
git push origin master
