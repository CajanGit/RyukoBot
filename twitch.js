const tmi = require('tmi.js')
const { sendToDiscord } = require('./bridge')
const { createClip } = require('./clips')
// Load environment variables
require('dotenv').config()

// Define the client configuration
const client = new tmi.Client({
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
  channels: [process.env.TWITCH_CHANNEL],
})

// This function will be called from index.js
function connectTwitch() {
  client.connect()
  console.log('Connected to Twitch chat!')
}

// Listen for any chat message
client.on('message', async (channel, tags, message, self) => {
  if (self) return // Ignore messages from the bot itself
  
  console.log(`[${tags.username}]: "${message}" | cleaned: "${message.trim().toLowerCase()}"`)

  const command = message.trim().toLowerCase()

  // tags.username is who sent it, message is what they said
  if (command === '!hello') {
    client.say(channel, `Hey ${tags.username}! 👋`)
  }

  if (command === '!ping') {
    client.say(channel, `✅ Bot is online and reading chat! Hey ${tags.username}!`)
  }

  if (command === 'six') {
    client.say(channel, "seven")
  }

  if (command === '!duo') {
    client.say(channel, "CkPineapply: https://www.twitch.tv/CKPineapply_")
  }

  if (command === '!golive') {
    if (tags.username.toLowerCase() !== process.env.TWITCH_CHANNEL.toLowerCase()) {
        client.say(channel, 'Sorry ${tags.username}, only the broadcaster can use that command')
        return
    }

    client.say(channel, '📣 Notifying Discord!')
    sendToDiscord(
      process.env.DISCORD_ANNOUNCE_CHANNEL_ID,
      `@everyone **We're live!** Come hang out → https://twitch.tv/${process.env.TWITCH_CHANNEL}`
    )
  }

  if (command == '!clip') {
    try {
    client.say(channel, '✂️ Creating clip...')
    const clipUrl = await createClip()

    if (clipUrl) {
      client.say(channel, `✅ Clip created! → ${clipUrl}`)
      sendToDiscord(
        process.env.DISCORD_CLIP_CHANNEL_ID,
        `✂️ **New clip!** ${clipUrl}`
      )
    } else {
      client.say(channel, '❌ Clip failed — is the stream live?')
    }
  } catch (err) {
    console.error('Clip error:', err)
    client.say(channel, '❌ Something went wrong creating the clip.')
  }
  }

   
})

module.exports = { connectTwitch, client }