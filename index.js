const mineflayer = require('mineflayer')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

let reconnecting = false

function startBot() {
  const bot = mineflayer.createBot({
    host: 'unitysmp.ddns.net',
    port: 33568,
    username: 'EllaMC',
    auth: 'offline',
    version: false
  })

  bot.on('spawn', () => {
    console.log("✅ Bot joined UnitySMP")

    const stayTime = randInt(3600, 43200) * 1000
    console.log(`⏳ Staying online for ${Math.floor(stayTime / 60000)} minutes`)

    setTimeout(() => {
      console.log("👋 Bot leaving (simulating a real player quit)...")
      bot.quit()
    }, stayTime)

    setInterval(() => {
      const yaw = Math.random() * 2 * Math.PI
      const pitch = (Math.random() - 0.5) * Math.PI
      bot.look(yaw, pitch, true)
    }, randInt(10, 60) * 1000)
  })

  function reconnect(reason = "unknown") {
    if (reconnecting) return
    reconnecting = true

    const rejoinDelay = randInt(1, 120) * 1000
    console.log(`🔄 Reconnecting in ${Math.floor(rejoinDelay / 1000)}s (reason: ${reason})...`)

    setTimeout(() => {
      reconnecting = false
      startBot()
    }, rejoinDelay)
  }

  bot.on('end', () => reconnect("disconnected"))
  bot.on('kicked', (reason) => {
    console.log("❌ Bot was kicked:", reason)
    reconnect("kicked")
  })
  bot.on('error', (err) => {
    console.log("⚠️ Error:", err.message)
    reconnect("error")
  })
}

startBot()

app.get('/', (req, res) => {
  res.send('AFK Bot is running ✅')
})

app.listen(PORT, () => {
  console.log(`🌐 Express server running on port ${PORT}`)
})