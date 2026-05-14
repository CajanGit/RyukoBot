const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

// Define your roles here — add/remove as you like
const ROLES = [
  { id: '1504586404892770314', label: '🔔 Stream Notifications', },
  { id: '1504586457950716034', label: '🔴 Youtube Notifications' },
  { id: '1504586338664448073', label: '🎓 STUDENT' },
]

// Builds and sends the role menu message
async function postRoleMenu(channel) {
  const buttons = ROLES.map(role =>
    new ButtonBuilder()
      .setCustomId(`role_${role.id}`)  // unique ID we'll use to identify clicks
      .setLabel(role.label)
      .setStyle(ButtonStyle.Primary)
  )

  const row = new ActionRowBuilder().addComponents(buttons)

  const msg = await channel.send({
    content: '**📋 Role Menu**\nClick a button to toggle a role!',
    components: [row],
  })

  return msg
}

module.exports = { postRoleMenu, ROLES }