require('dotenv').config()
const { connectTwitch } = require ("./twitch")
const { client: discordClient } = require ("./discord")

discordClient.once('clientReady', () => {
    connectTwitch()
})