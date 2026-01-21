#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$DIR/.."
#!
source ./scripts/env-build.sh

aws sts get-caller-identity

pushd janitor-cdk
npm install
npx cdk bootstrap
npx cdk deploy --all --require-approval never
popd

#!
popd
