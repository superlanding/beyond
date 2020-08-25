#!/bin/bash
rm -r _site 2> /dev/null
NODE_ENV=production webpack
JEKYLL_ENV=production bundle exec jekyll build --config _config_github.yml
