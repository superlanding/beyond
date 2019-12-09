#!/bin/bash

JEKYLL_ENV=production jekyll build --config _config_github.yml
NODE_ENV=production webpack
