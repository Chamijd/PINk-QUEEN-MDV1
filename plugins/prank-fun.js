const { cmd } = require('../command');
const path = require('path');

cmd({
    pattern: "hack",
    desc: "Scary ultra-realistic hacking simulation with media.",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, senderNumber, reply
}) => {
    try {
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("Permission denied.");
        }

        // Fake dynamic data
        const formattedNumber = "+" + senderNumber.split("@")[0];
        const fakeIP = `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 255)}`;
        const fakeDeviceID = [...Array(6)].map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
        const fakeFile = `msg_backup_${Math.floor(Math.random() * 99999)}.crypt12`;
        const fakeLocation = ['Colombo, LK', 'Galle, LK', 'Anuradhapura, LK', 'Trincomalee, LK'][Math.floor(Math.random() * 4)];

        const steps = [
            '⚡ Initializing breach protocols...',
            '✅ Root access: GRANTED',
            '',
            `🎯 Target: ${formattedNumber}`,
            `🛰️ IP: ${fakeIP}`,
            `📍 Location: ${fakeLocation}`,
            `🔧 Device ID: ${fakeDeviceID}`,
            '',
            'Deploying surveillance tools...',
            '📷 Camera: STREAMING (front)',
            '🎤 Mic: RECORDING',
            '',
            'Extracting data...',
            `📂 Found: ${fakeFile}`,
            '🔓 Decryption: SUCCESS',
            '🔗 Syncing with TOR nodes...',
            '🌐 Upload complete',
            '',
            '⌛ Countdown: 5... 4... 3... 2... 1...',
            '',
            '☠️ DEVICE OVERRIDDEN ☠️',
            '📡 Target now under monitoring.',
            '*END TRANSMISSION*'
        ];

        // Start step-by-step suspense
        for (const line of steps) {
            await conn.sendMessage(from, { text: line }, { quoted: mek });
            await new Promise(res => setTimeout(res, 1000));
        }

        // Send Voice Note (PTT)
        await conn.sendMessage(from, {
            audio: { url: path.resolve('./media/access-granted.mp3') },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

        // Send Scary Image
        await conn.sendMessage(from, {
            image: { url: path.resolve('./media/device-breached.jpg') },
            caption: 'DEVICE STATUS: BREACHED'
        }, { quoted: mek });

        // Send Spoof Contact
        await conn.sendMessage(from, {
            contacts: {
                displayName: 'ඇන්ටි කාසිපා',
                contacts: [{
                    vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:ඇන්ටි කාසිපා\nTEL;type=CELL:+94771234567\nEND:VCARD'
                }]
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});
