#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$DIR/.."
#!
pushd janitor-nuxt
rm -rf target
mkdir -p target
npm run build:aws
pushd .output
zip -r ../target/output.zip .
popd
unzip -l target/output.zip
popd
#!
popd
