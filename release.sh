#!/bin/bash

yarn deploy
npm version patch
git push --tags
npm publish
