const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot is alive or not",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const now = new Date();

        // Get Sri Lanka time
        const time = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "Asia/Colombo"
        });

        // Emoji digits + letters map
        const emojiMap = {
            "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣",
            "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣",
            "8": "8️⃣", "9": "9️⃣", ":": ":", "A": "🅰️",
            "P": "🅿️", "M": "Ⓜ️", " ": " "
        };

        const emojiTime = time.split("").map(c => emojiMap[c] || c).join("");

        const status = `
╭───〔 *🤖 ${config.BOT_NAME} STATUS* 〕───◉
│✨ *Bot is Active & Online!*
│
│🧠 *Owner:* ${config.OWNER_NAME}
│⚡ *Version:* 1.0.0
│📝 *Prefix:* [${config.PREFIX}]
│📳 *Mode:* [${config.MODE}]
│⌚ *Time (LK):* ${emojiTime}
│💾 *RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
│🖥️ *Host:* ${os.hostname()}
│⌛ *Uptime:* ${runtime(process.uptime())}
╰────────────────────◉
> ${config.DESCRIPTION}`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419192353625@newsletter',
                    newsletterName: '☈☟𝗖𝗛𝗔𝗠𝗔 𝗠𝗗 𝗩1️⃣',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
