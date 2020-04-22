#!/bin/bash

npm whoami > /dev/null

NPM_LOGGED_IN=$?

if [ $NPM_LOGGED_IN -ne 0 ]; then
  npm login
fi

yarn deploy
# NPM release
NEXT_VERSION=$(npm version patch | sed -e 's/v/''/g')
# Ruby Gem release (TODO: 幫忙 FIX)
# ruby -e "version_file = File.read('lib/beyond/version.rb'); content = version_file.gsub(/VERSION\ =\ '([0-9\.]+)'.freeze/, \"VERSION = '${NEXT_VERSION}'.freeze\"); File.write('lib/beyond/version.rb', content)"
# git add lib/beyond/version.rb
# git commit -m "Rybygem bump version: ${NEXT_VERSION}"
# gem build beyond.gemspec
# gem push beyond-rails-$NEXT_VERSION.gem
# rm beyond-rails-$NEXT_VERSION.gem

# 說明：
# Ruby gem 版本升級，必須做以下步驟：
# 1. Beyond::Version (lib/beyond/version.rb) 更新版號 (不能有v開頭)
# 2. Git Commit
# 3. gem build beyond.gemspec (壓縮成 gem)
# 4. gem push beyond-rails-$NEXT_VERSION.gem
# 5. 刪除 beyond-rails-$NEXT_VERSION.gem
#
# Gem 網站：https://rubygems.org/gems/beyond-rails
# 關於 Gem publish 的 permission 已經增加 (kmsh3ng@gmail.com) 請去註冊 rubygems.org 網站

git push --tags
bash -l -c "npm publish"

CURRENT_HASH=$(git rev-parse HEAD)
git co master
git cherry-pick $CURRENT_HASH
git push origin master
