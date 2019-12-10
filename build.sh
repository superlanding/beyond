#!/bin/bash
rm -r _site 2> /dev/null
NODE_ENV=production webpack
JEKYLL_ENV=production jekyll build --config _config_github.yml
