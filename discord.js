const { Client, GatewayIntentBits } = require('discord.js')
const { registerSender } = require('./bridge')
const { getSavedMessageId, saveMessageId } = require('./store')
require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.MessageContent,
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

  const rolesChannel = client.channels.cache.get(process.env.DISCORD_ROLES_CHANNEL_ID) || await client.channels.fetch(process.env.DISCORD_ROLES_CHANNEL_ID)

  if (rolesChannel) {
    const savedId = getSavedMessageId()

    if (savedId) {
      try {
        // Try to fetch the existing message — if it's still there, do nothing
        await rolesChannel.messages.fetch(savedId)
        console.log('✅ Role menu already exists, skipping post')
      } catch {
        // Message was deleted — post a fresh one
        console.log('⚠️ Saved role menu not found, posting new one')
        const msg = await postRoleMenu(rolesChannel)
        saveMessageId(msg.id)
      }
    } 
    else {
      // First run — no saved ID at all
      const msg = await postRoleMenu(rolesChannel)
      saveMessageId(msg.id)
    }
  }
})

client.on('messageCreate', async (message) => {
  // Ignore bots (including itself)
  if (message.author.bot) return

  // Check if it starts with !clear
  if (!message.content.startsWith('!clear')) return

  // Parse the argument — split "!clear 10" into ["!clear", "10"]
  const args = message.content.split(' ')
  const amount = parseInt(args[1])

  // --- Guard clauses (teach the bot to fail gracefully) ---

  // Only allow mods/admins — ManageMessages permission check
  if (!message.member.permissions.has('ManageMessages')) {
    return message.reply('❌ You need the **Manage Messages** permission to use this.')
  }

  if (!amount || isNaN(amount)) {
    return message.reply('⚠️ Please provide a number. Usage: `!clear 10`')
  }

  if (amount < 1 || amount > 100) {
    return message.reply('⚠️ Please provide a number between 1 and 100.')
  }

  // Delete the command message itself + the requested amount
  // We add 1 so that "!clear 10" deletes 10 messages PLUS the command itself
  try {
    await message.delete()
    const deleted = await message.channel.bulkDelete(amount, true)
    // The second argument `true` filters out messages older than 14 days automatically

    const confirmation = await message.channel.send(
      `🧹 Deleted **${deleted.size}** messages.`
    )

    // Auto-delete the confirmation after 4 seconds so it doesn't clutter chat
    setTimeout(() => confirmation.delete(), 4000)

  } catch (err) {
    console.error('Clear error:', err)
    message.reply('❌ Something went wrong. Messages may be older than 14 days.')
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