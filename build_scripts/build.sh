#!/bin/bash

# error out of the script (fail the build) on any non-zero return status
set -e

# for whatever reason, we can't rely on electron-builder env vars here
# (out of scope?), so we pass in our own for the OS and version
if [  -z "$BUILD_OS" ]
then 
  echo "Failing build - BUILD_OS is unset"
  exit 1
else
  echo "BUILD_OS set to ${BUILD_OS}"
fi

# create BUILD_VER from the package.json, then test we have it
export BUILD_VER=`node build_scripts/create-version-env.ts`

if [  -z "$BUILD_VER" ]
then 
  echo "Failing build - BUILD_VER is unset"
  exit 1
else
  echo "BUILD_VER set to ${BUILD_VER}"
fi

echo "Installing Butler"
if [ ${BUILD_OS} = "osx" ] || [ ${BUILD_OS} = "win" ]
then
  curl -L -o butler.zip https://broth.itch.ovh/butler/darwin-amd64/LATEST/archive/default
elif [ ${BUILD_OS} = "linux" ]
then
  curl -L -o butler.zip https://broth.itch.ovh/butler/linux-amd64/LATEST/archive/default
fi
unzip butler.zip
# GNU unzip tends to not set the executable bit even though it's set in the .zip
chmod +x butler
./butler -V

echo "---Starting Build---"
if [ ${BUILD_OS} = "osx" ]
then
  yarn dist-travis -m --publish never
  cat build/${BUILD_OS}-${TRAVIS_BRANCH}/latest-mac.yml
  rm -rf build/${BUILD_OS}-${TRAVIS_BRANCH}/mac build/${BUILD_OS}-${TRAVIS_BRANCH}/latest-mac.yml
elif [ ${BUILD_OS} = "linux" ]
then
  yarn dist-travis -l --publish never
  cat build/${BUILD_OS}-${TRAVIS_BRANCH}/latest-linux.yml
  rm -rf build/${BUILD_OS}-${TRAVIS_BRANCH}/linux-unpacked build/${BUILD_OS}-${TRAVIS_BRANCH}/latest-linux.yml
elif [ ${BUILD_OS} = "win" ]
then
  yarn dist-travis -w --publish never
  rm -rf build/${BUILD_OS}-${TRAVIS_BRANCH}/win-ia32-unpacked build/${BUILD_OS}-${TRAVIS_BRANCH}/win-unpacked
fi
echo "---Pushing ${BUILD_OS} build for branch ${TRAVIS_BRANCH} to Itch.io---"
echo "./butler push build/${BUILD_OS}-${TRAVIS_BRANCH} beeftime/compcon:${BUILD_OS}-${TRAVIS_BRANCH}  --userversion ${BUILD_VER}"
./butler push build/${BUILD_OS}-${TRAVIS_BRANCH} beeftime/compcon:${BUILD_OS}-${TRAVIS_BRANCH}  --userversion ${BUILD_VER}
echo "---Build and Deployment for ${BUILD_OS} platform, ${TRAVIS_BRANCH} branch complete!"
