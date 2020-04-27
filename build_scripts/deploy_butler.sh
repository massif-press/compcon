#!/bin/bash

TAG_BUILD_VERSION=`echo $TRAVIS_TAG | cut -d'-' -f1`
build_type=`echo $TRAVIS_TAG | cut -d'-' -f2`

MAC_ITCH_CHANNEL="aritsune/compcon-test:mac"
WIN_ITCH_CHANNEL="aritsune/compcon-test:win"
LINUX_ITCH_CHANNEL="aritsune/compcon-test:linux"

curl -L -o butler.zip https://broth.itch.ovh/butler/darwin-amd64/LATEST/archive/default &&
unzip butler.zip &&
chmod +x butler &&
./butler -V &&
ls ./electron/dist &&
curl -F "file=@./electron/dist/COMPCON.dmg" https://file.io &&
./butler push ./electron/dist/COMPCON.exe ${WIN_ITCH_CHANNEL} --userversion ${TAG_BUILD_VERSION} &&
# mac needs fixed
# ./butler push ./electron/dist/COMPCON.dmg ${MAC_ITCH_CHANNEL} --userversion ${TAG_BUILD_VERSION} &&
./butler push ./electron/dist/COMPCON.AppImage ${LINUX_ITCH_CHANNEL} --userversion ${TAG_BUILD_VERSION}