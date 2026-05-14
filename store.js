const fs = require('fs')
const path = require('path')

const STORE_PATH = path.join(__dirname, 'store.json')

// Load the file, or return an empty object if it doesn't exist yet
function loadStore() {
  if (!fs.existsSync(STORE_PATH)) return {}
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'))
}

// Write the entire store back to disk
function saveStore(data) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2))
}

function getSavedMessageId() {
  return loadStore().roleMenuMessageId || null
}

function saveMessageId(id) {
  const store = loadStore()
  store.roleMenuMessageId = id
  saveStore(store)
}

module.exports = { getSavedMessageId, saveMessageId }