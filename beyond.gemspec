lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'beyond/version'

Gem::Specification.new do |s|
  s.name     = 'beyond-rails'
  s.version  = Beyond::VERSION
  s.authors  = ['kmsheng', "Eddie Li"]
  s.email    = 'kmsh3ng@gmail.com'
  s.summary  = 'beyond is a collection of frontend components which aims for admin website.'
  s.homepage = 'https://superlanding.github.io/beyond/'
  s.license  = 'MIT'

  s.add_runtime_dependency 'sassc', '~> 2.0', '>= 2.0.0'
  s.add_runtime_dependency 'autoprefixer-rails', '~> 9.7', '>= 9.7.6'

  s.files    = `git ls-files -- src/*`.split("\n")

  s.require_paths = ["lib"]

  s.add_dependency("actionpack", ">= 5.0", "< 7.0")
  s.add_dependency("activemodel", ">= 5.0", "< 7.0")
  s.add_dependency("will_paginate", ">= 3.3.0")
end
