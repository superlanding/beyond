require "bundler/gem_tasks"
require "rake/testtask"

# Ruby 部分（Rails helper / form builder / pagination）的測試。
# JS 測試仍使用 `yarn test`（ava）。
Rake::TestTask.new(:t) do |t|
  t.libs << "test/ruby"
  t.libs << "lib"
  t.test_files = FileList["test/ruby/**/*_test.rb"]
end

task :default => :t
