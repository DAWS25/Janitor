#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$DIR/.."
#!
source ./scripts/build.sh

aws sts get-caller-identity
sleep 15

pushd janitor-cdk
cdk deploy
popd

#!
popd
