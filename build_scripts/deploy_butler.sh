#!/bin/bash

TAG_BUILD_VERSION=`echo $TRAVIS_TAG | cut -d'-' -f1`
build_type=`echo $TRAVIS_TAG | cut -d'-' -f2`


MAC_ITCH_CHANNEL="massif-press/compcon:osx"
WIN_ITCH_CHANNEL="massif-press/compcon:win"
LINUX_ITCH_CHANNEL="massif-press/compcon:linux"


curl -L -o butler.zip https://broth.itch.ovh/butler/linux-amd64/LATEST/archive/default &&
unzip butler.zip &&
chmod +x butler &&
./butler -V &&
./butler push ./electron/dist/COMPCON*.exe ${WIN_ITCH_CHANNEL} --userversion ${TAG_BUILD_VERSION} &&
./butler push ./electron/dist/COMPCON*mac.zip ${MAC_ITCH_CHANNEL} --userversion ${TAG_BUILD_VERSION} &&
./butler push ./electron/dist/COMPCON*.AppImage ${LINUX_ITCH_CHANNEL} --userversion ${TAG_BUILD_VERSION}