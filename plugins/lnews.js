cmd({
    pattern: "lankadeepa",
    desc: "Get news from Lankadeepa site",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const res = await axios.get('https://lankadeepa-api.onrender.com/lankadeepa');
        const news = res.data;

        if (!news.length) return reply("⚠️ ලිපි කිසිවක් හමු නොවුණා!");

        const top = news[0]; // first news
        const caption = `📰 *Lankadeepa News*\n\n*${top.title}*\n\n🔗 ${top.url}`;

        await conn.sendMessage(from, {
            image: { url: top.image },
            caption: caption
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("❌ දෝෂයක් ඇතිවී ඇත.");
    }
});
