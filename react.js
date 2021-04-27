#!/usr/bin/env node
require('dotenv').config()
const meow = require('meow')
const react = require('./lib')

const cli = meow(
  `
    Usage
        $ react --to morning,sunrise --reaction wave --channel general

    Options
        --to Comma seperated list of case-insensitive messages to react to
        --reaction Slack reaction name
        --channel  Look for messages to react to in this channel
        --oauth-token Slack oauth token with channels:read, channels:history, reactions:read, and reactions:write scopes
        --latest Only react to the latest N messages
        --undo Remove reactions rather than add them (include this to reverse a previous command)

    Examples
        $ react --to morning,sunrise --reaction wave --channel general --oauth-token xoxp-SLACK-OAUTH-TOKEN
        ✨ Reacted to 10 people!
        $ react --undo --to morning,sunrise --reaction wave --channel general --oauth-token xoxp-SLACK-OAUTH-TOKEN
        ✨ Removed reaction from 10 people.

    Env
        You may supply SLACK_OAUTH_TOKEN instead of the --oauth-token cli option.
`,
  {
    flags: {
      to: {
        type: 'string',
        isRequired: true,
      },
      reaction: {
        type: 'string',
        isRequired: true,
      },
      channel: {
        type: 'string',
        isRequired: true,
      },
      latest: {
        type: 'number',
      },
      undo: {
        type: 'boolean',
        default: false,
      },
      oauthToken: {
        type: 'string',
        isRequired: () => {
          if (!process.env.SLACK_OAUTH_TOKEN) {
            return true
          }

          return false
        },
      },
    },
  }
)

react({
  channel: cli.flags.channel,
  reactTo: cli.flags.to,
  reaction: cli.flags.reaction,
  latest: cli.flags.latest,
  undo: cli.flags.undo,
  oauthToken: cli.flags.oauthToken || process.env.SLACK_OAUTH_TOKEN,
})
