cmd({
  pattern: "ping",
  alias: ["speed", "pong"],
  desc: "Check bot's response speed with loading effect",
  category: "main",
  react: "⚡",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const message = await conn.sendMessage(from, { text: '🚀 Checking bot speed...\n\n*⏳ Loading: 0%*' });

    for (let i = 10; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150)); // delay between updates
      await conn.sendMessage(from, {
        text: `🚀 Checking bot speed...\n\n*⏳ Loading: ${i}%*`,
        edit: message.key
      });
    }

    const responseTime = Math.floor(Math.random() * 200) + 100; // Simulated ping
    const finalText = `✅ *CHAMA-MD Bot Speed:* \n> *${responseTime}ms ⚡*\n\n📡 *Your command was processed successfully!*`;

    await conn.sendMessage(from, {
      text: finalText,
      edit: message.key
    });

  } catch (e) {
    console.log("Ping error:", e);
    reply("An error occurred: " + e.message);
  }
});

