#!/bin/bash

export TAG_BUILD_VERSION=`echo $TRAVIS_TAG | cut -d'-' -f1`
build_type=`echo $TRAVIS_TAG | cut -d'-' -f2`

if [ `echo $TRAVIS_TAG | cut -d'-' -f2` == "stable" ]
then
    echo "HIT STABLE BRANCH!"
    export MAC_ITCH_CHANNEL="massif-press/compcon:osx"
    echo $MAC_ITCH_CHANNEL
    export WIN_ITCH_CHANNEL="massif-press/compcon:win"
    echo $WIN_ITCH_CHANNEL
    export LINUX_ITCH_CHANNEL="massif-press/compcon:linux"
    echo $LINUX_ITCH_CHANNEL
else
    echo "HIT OTHER TAG BRANCH!"
    export MAC_ITCH_CHANNEL="massif-press/compcon:osx-${build_type}"
    echo $MAC_ITCH_CHANNEL
    export WIN_ITCH_CHANNEL="massif-press/compcon:win-${build_type}"
    echo $WIN_ITCH_CHANNEL
    export LINUX_ITCH_CHANNEL="massif-press/compcon:linux-${build_type}"
    echo $LINUX_ITCH_CHANNEL
fi
