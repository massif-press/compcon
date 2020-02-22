#!/bin/bash

YELLOW=`tput setaf 3`
GREEN=`tput setaf 2`
RED=`tput setaf 1`
BOLD=`tput bold`
NC=`tput sgr0`
CHECK="${GREEN}✔${NC}"

VERSION=$1
VERSION_FANCY="${YELLOW}${BOLD}$VERSION${NC}"

function do_rollback {
    echo "${BOLD}${YELLOW}!${NC} Rolling back..." &&
    echo "${BOLD}${YELLOW}!${NC} Deleting tag..." &&
    git tag -d $VERSION &&
    echo "${BOLD}${YELLOW}!${NC} Reverting file changes..." &&
    git reset --hard HEAD^ &&
    exit
}

if [ -z "$VERSION" ]
then
    echo "${RED}✗${NC} No tag provided!"
    exit 1
fi

if git rev-parse $VERSION >/dev/null 2>&1
then
    echo "${RED}✗${NC} Tag $VERSION_FANCY already exists!"
    exit 1
fi

npm version $VERSION --no-git-tag-version > /dev/null &&
echo "${CHECK} Set version in package.json" &&
npx standard-changelog &&
git add package.json CHANGELOG.md > /dev/null &&
git commit -m "chore(release): $VERSION" > /dev/null &&
echo "${CHECK} Created release commit" &&
git tag $VERSION &&
echo "${CHECK} Tagged release commit" &&
echo "${CHECK} Release $VERSION_FANCY is ready!" &&
echo "${BOLD}${YELLOW}!${NC} Please check that everything is in order (changelog, latest commits, etc.) before continuing." &&
echo "${BOLD}${YELLOW}!${NC} Push release ${VERSION} to remote?"
while true; do
    read -p "${BOLD}${YELLOW}!${NC} Push release ${VERSION} to remote? [y/n]" yn
    case $yn in
        [Yy]* ) git push --tags && git push; break;;
        [Nn]* ) do_rollback;;
        * ) echo "Please answer yes or no.";;
    esac
done