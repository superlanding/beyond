lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'beyond/version'

Gem::Specification.new do |s|
  s.name     = 'beyond'
  s.version  = Beyond::VERSION
  s.authors  = ['kmsheng']
  s.email    = 'kmsh3ng@gmail.com'
  s.summary  = 'beyond is a collection of frontend components which aims for admin website.'
  s.homepage = 'https://github.com/@superlanding/beyond'
  s.license  = 'MIT'

  s.add_runtime_dependency 'sassc', '~> 2.0', '>= 2.0.0'
  s.add_runtime_dependency 'autoprefixer-rails', '~> 5.2', '>= 5.2.1'

  s.files    = `git ls-files -- src/*`.split("\n")
end
