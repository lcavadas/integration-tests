#!/usr/bin/env sh
GIT_TAG=$(git tag --points-at HEAD)
GIT_COMMIT=$(git rev-parse --short HEAD)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
PROJECT_NAME=$(jq -s add package.json | jq '.name')
GIT_ID="${GIT_TAG:-"$GIT_COMMIT@$GIT_BRANCH"}"
USER_TOKEN=$ADMIN_TOKEN

echo "{}" \
  | jq '.project'=$PROJECT_NAME \
  | jq '.commit'=\""$GIT_ID"\" \
  | jq '.["browserstack.user"]'=\""$BROWSERSTACK_USER"\" \
  | jq '.["browserstack.key"]'=\""$BROWSERSTACK_KEY"\" \
  | jq '.["token"]'=\""$USER_TOKEN"\" \
  | envsubst > worlds/browserstack/commit.json
