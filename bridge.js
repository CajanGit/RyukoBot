let discordSender = null

function registerSender(fn) {
  discordSender = fn
}

function sendToDiscord(channelId, message) {
  if (discordSender) {
    console.log(`Attempting to send to channel: ${channelId}`)
    discordSender(channelId, message)
  } else {
    console.error('Discord sender not registered yet!')
  }
}

module.exports = { registerSender, sendToDiscord }