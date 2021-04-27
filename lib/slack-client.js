const { WebClient, LogLevel } = require('@slack/web-api')

class SlackClient {
  constructor(slackOauthToken) {
    this.client = new WebClient(slackOauthToken, {
      logLevel: LogLevel.INFO,
    })
    this.fetchChannelConversations = this.fetchChannelConversations.bind(this)
    this.addReaction = this.addReaction.bind(this)
  }

  async fetchChannelConversations({ channel }) {
    try {
      return await this.client.conversations.history({
        channel,
      })
    } catch (error) {
      console.error(error)
    }
    return { ok: false, messages: [] }
  }

  async fetchChannelList() {
    try {
      return await this.client.conversations.list()
    } catch (error) {
      console.error(error)
    }
    return { ok: false, channels: [] }
  }

  async addReaction({ name, channel, timestamp }) {
    try {
      return await this.client.reactions.add({
        name,
        channel,
        timestamp,
      })
    } catch (error) {
      if (error?.data?.error !== 'already_reacted') {
        console.error(error)
        return { ok: false }
      }
      return { ok: true, already_reacted: true }
    }
  }

  async removeReaction({ name, channel, timestamp }) {
    try {
      return await this.client.reactions.remove({
        name,
        channel,
        timestamp,
      })
    } catch (error) {
      if (error?.data?.error !== 'no_reaction') {
        console.error(error)
        return { ok: false }
      }
      return { ok: true, no_reaction: true }
    }
  }
}

module.exports = {
  SlackClient,
}
