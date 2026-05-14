require('dotenv').config()

async function createClip() {
  const response = await fetch('https://api.twitch.tv/helix/clips', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    // Tell Twitch which channel to clip
    body: JSON.stringify({
      broadcaster_id: process.env.TWITCH_BROADCASTER_ID,
    })
  })

  const data = await response.json()

  if (!data.data || data.data.length === 0) {
    console.error('Clip creation failed:', data)
    return null
  }

  // Twitch returns the clip ID — we build the URL from it
  const clipId = data.data[0].id
  const clipUrl = `https://clips.twitch.tv/${clipId}`

  return clipUrl
}

module.exports = { createClip }