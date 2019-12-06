#!/bin/bash

JEKYLL_ENV=production jekyll build --config _config_github.yml
NODE_ENV=production webpack
cp dist/beyond.js _site/assets/js/beyond.js
