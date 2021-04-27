require('dotenv').config()
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const prettier = require('prettier')
const { SlackClient } = require('./lib/slack-client')

const client = new SlackClient(process.env.SLACK_OAUTH_TOKEN)

async function regenerateChannelDirectory() {
  let { ok, channels } = await client.fetchChannelList()
  if (!ok) {
    return
  }
  let channelDB = channels.reduce((acc, channel) => {
    acc[channel.name] = channel.id
    return acc
  }, {})

  let prettierOpts = await prettier.resolveConfig('package.json')

  let template = prettier.format(
    `// AUTOMATICALLY GENERATED FILE; DO NOT EDIT\n\n

const channelDB = ${JSON.stringify(channelDB)}

module.exports = channelDB
`,
    { parser: 'babel', ...prettierOpts }
  )

  let filePath = path.resolve(__dirname, 'lib', 'channel-directory.js')
  fs.writeFileSync(filePath, template)

  console.log(chalk.whiteBright(`Regenerated ${filePath}`))
}

regenerateChannelDirectory()
