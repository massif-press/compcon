#!/bin/bash

export TAG_BUILD_VERSION=`echo $TRAVIS_TAG | cut -d'-' -f1`
build_type=`echo $TRAVIS_TAG | cut -d'-' -f2`

if [ `echo $TRAVIS_TAG | cut -d'-' -f2` == "stable" ]
then
    export MAC_ITCH_CHANNEL="massif-press/compcon:osx"
    export WIN_ITCH_CHANNEL="massif-press/compcon:win"
    export LINUX_ITCH_CHANNEL="massif-press/compcon:linux"
else
    export MAC_ITCH_CHANNEL="massif-press/compcon:osx-${build_type}"
    export WIN_ITCH_CHANNEL="massif-press/compcon:win-${build_type}"
    export LINUX_ITCH_CHANNEL="massif-press/compcon:linux-${build_type}"
fi

curl -L -o butler.zip https://broth.itch.ovh/butler/darwin-amd64/LATEST/archive/default &&
unzip butler.zip &&
chmod +x butler &&
./butler -V &&
./butler push ./electron/dist/COMPCON*.exe massif-press/compcon:test-hidden --userversion 0.0.0