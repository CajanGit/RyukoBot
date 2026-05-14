const { Client, GatewayIntentBits } = require('discord.js')
const { registerSender } = require('./bridge')
require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers, 
  ]
})

const { postRoleMenu, ROLES } = require ('./roleMenu')

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return

    if (!interaction.customId.startsWith('role_')) 
        return

    const roleId = interaction.customId.replace('role_', '')
    const member = interaction.member
    const role = interaction.guild.roles.cache.get(roleId)

    if (!role) {
        await interaction.reply({ content: 'Role not found!', ephemeral: true})
        return
    }

    if (member.roles.cache.has(roleId)) {
        await member.roles.remove(role)
        await interaction.reply({ content: `✅ Removed **${role.name}**`, ephemeral: true })
    } 
    else {
    await member.roles.add(role)
    await interaction.reply({ content: `✅ Added **${role.name}**`, ephemeral: true })
        }
    })
client.once('clientReady', async () => {
  console.log(`✅ Discord bot online as ${client.user.tag}`)

  registerSender(async (channelId, message) => {

  try {
    const channel = client.channels.cache.get(channelId) 
        || await client.channels.fetch(channelId)

    if (channel) channel.send(message)
    else console.error('Discord channel not found!')
  } catch (err) {
    console.error('Error sending to Discord:', err.message)
  }
  })

  const rolesChannel = client.channels.cache.get(process.env.DISCORD_ROLES_CHANNEL_ID)
  if (rolesChannel) {
    await postRoleMenu(rolesChannel)
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)

// This is what twitch.js will call to send a message to Discord
function sendToDiscord(channelId, message) {
  const channel = client.channels.cache.get(channelId)
  if (channel) {
    channel.send(message)
  } else {
    console.error('Discord channel not found!')
  }
}

module.exports = { sendToDiscord, client }