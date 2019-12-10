#!/bin/bash

NODE_ENV=production webpack
JEKYLL_ENV=production jekyll build --config _config_github.yml
