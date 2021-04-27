const chalk = require('chalk')
const plur = require('plur')
const channelDirectory = require('./channel-directory')
const { SlackClient } = require('./slack-client')

async function react({ channel, reactTo, reaction, latest, undo, oauthToken }) {
  let client = new SlackClient(oauthToken)
  let reactToMessages = reactTo.split(',')
  if (!reactToMessages.length) {
    chalk.red(
      'Invalid --to flag supplied. Please pass a comma separated string of words to react to.'
    )
    return
  }

  let channelId = channelDirectory[channel]
  if (!channelId) {
    chalk.red(
      `Could not find channel name "${channel}". If this channel exists, contact the author to regenerate the channel directory.`
    )
  }
  let { ok, messages } = await client.fetchChannelConversations({
    channel: channelId,
  })
  if (!ok) {
    return
  }

  let latestCount = 0
  let promises = []
  for (let i = 0; i < messages.length; i++) {
    let text = messages[i].text.toLowerCase().trim()
    if (reactToMessages.some((m) => text.includes(m))) {
      if (undo) {
        promises.push(
          client.removeReaction({
            name: reaction,
            channel: channelId,
            timestamp: messages[i].ts,
          })
        )
      } else {
        promises.push(
          client.addReaction({
            name: reaction,
            channel: channelId,
            timestamp: messages[i].ts,
          })
        )
      }

      latestCount++
    }
    if (latest && latestCount === latest) {
      break
    }
  }

  let results = await Promise.all(promises)
  let reactionCount = results.reduce((count, result) => {
    if (result && result.ok && !result.already_reacted && !result.no_reaction) {
      count += 1
    }
    return count
  }, 0)

  let verb = undo ? 'Removed reaction from' : 'Reacted to'
  let punctuation = undo ? '.' : '!'
  console.log(
    chalk.blue(
      `✨ ${verb} ${reactionCount} ${plur(
        'person',
        reactionCount
      )}${punctuation}`
    )
  )
}

module.exports = react
