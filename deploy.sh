#!/bin/bash

git show --date=short --pretty=format:"%h,%ad,$(git tag --sort=-taggerdate |head -n1)" -q --encoding=UTF-8 >public/version.info

rm -rf dist

yarn build

cd dist

git init
git add .
git commit -m "deploy gh-pages"
git branch -M gh-pages
git remote add gh-pages thincen-github:thincen/carplate.git
git push -uf gh-pages gh-pages
