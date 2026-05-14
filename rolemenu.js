const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

// Define your roles here — add/remove as you like
const ROLES = [
  { id: 'YOUR_ROLE_ID_1', label: '🔔 Stream Notifications', },
  { id: 'YOUR_ROLE_ID_2', label: '🔴 Youtube Notifications' },
  { id: 'YOUR_ROLE_ID_3', label: '🎓 STUDENT' },
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

  await channel.send({
    content: '**📋 Role Menu**\nClick a button to toggle a role!',
    components: [row],
  })
}

module.exports = { postRoleMenu, ROLES }