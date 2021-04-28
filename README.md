# React

> A Reaction Slackbot to easily react to messages in a channel

## Node

```
nodenv install $(cat .node-version)
```

You may need to update your version of `node-build` if the definition isn't found:

```
brew update && brew upgrade node-build
```

## Install deps

```
yarn
```

## Build

```
yarn global add pkg
yarn build
mv react-macos /usr/local/bin/react
```

## Format

```
yarn format
```

## Slack oauth token setup

1. Visit https://api.slack.com/apps and select "Create New App"
2. Name your app whatever you like, e.g. "React ${yourname}"
3. Choose the strongDM Development Slack Workspace
4. After creation, click OAuth & Permissions in the left navbar
5. Scroll down to Scopes / User Token Scopes
6. Add an OAuth Scope for the scopes: `channels:read`, `channels:history`, `reactions:read`, and `reactions:write`
7. Scroll to the top of the page and click "Install to Workspace"
8. Copy and use the OAuth token provided on the CLI or with the SLACK_OAUTH_TOKEN environment variable

## Useful Aliases

```
alias goodmorning='react --to morning,sunrise,hello --channel general --reaction wave'
alias dibs='react --to dibs --channel dev --reaction thumbsup --latest 1'
```
