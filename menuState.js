const fs = require('fs')
const STATE_FILE = './menuState.json'

function getSavedMessageId() {
  if (!fs.existsSync(STATE_FILE)) return null
  try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
    return data.roleMenuMessageId || null
  } catch { return null }
}

function saveMessageId(id) {
  fs.writeFileSync(STATE_FILE, JSON.stringify({ roleMenuMessageId: id }))
}

module.exports = { getSavedMessageId, saveMessageId }