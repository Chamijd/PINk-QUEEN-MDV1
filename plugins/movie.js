const axios = require('axios');
const cheerio = require('cheerio');
const { cmd, readEnv } = require('../lib');
const os = require('os');

const headers1 = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://google.com',
};

// Fetch search results and download links
async function getMovieDetailsAndDownloadLinks(query) {
  try {
    const response = await axios.get(`https://cinesubz.co/?s=${encodeURIComponent(query)}`, {
      headers: headers1,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);
    const films = [];

    $('article').each((_, el) => {
      const filmName = $(el).find('.details .title a').text().trim();
      const imageUrl = $(el).find('.image .thumbnail img').attr('src');
      const description = $(el).find('.details .contenido p').text().trim();
      const year = $(el).find('.details .meta .year').text().trim();
      const imdb = $(el).find('.details .meta .rating:first').text().trim().replace('IMDb', '').trim();
      const movieLink = $(el).find('.image .thumbnail a').attr('href');
      films.push({ filmName, imageUrl, description, year, imdb, movieLink });
    });

    for (const film of films) {
      const moviePageResponse = await axios.get(film.movieLink, { headers: headers1 });
      const $$ = cheerio.load(moviePageResponse.data);
      const downloadLinks = [];

      $$('a[href^="https://cinesubz.co/api-"]').each((_, el) => {
        const link = $$(el).attr('href');
        const quality = $$(el).text().trim();
        const size = $$(el).closest('li').next().text().trim();
        downloadLinks.push({ link, quality, size });
      });

      film.downloadLinks = downloadLinks;
    }

    return films;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

// Modify download link
async function scrapeModifiedLink(url) {
  try {
    const response = await axios.get(url, { headers: headers1 });
    const $ = cheerio.load(response.data);
    let modifiedLink = $('#link').attr('href');

    if (!modifiedLink) return url;

    const urlMappings = [
      { search: ["https://google.com/server11/1:/", "https://google.com/server12/1:/", "https://google.com/server13/1:/"], replace: "https://cinescloud.cskinglk.xyz/server1/" },
      { search: ["https://google.com/server21/1:/", "https://google.com/server22/1:/", "https://google.com/server23/1:/"], replace: "https://cinescloud.cskinglk.xyz/server2/" },
      { search: ["https://google.com/server3/1:/"], replace: "https://cinescloud.cskinglk.xyz/server3/" },
      { search: ["https://google.com/server4/1:/"], replace: "https://cinescloud.cskinglk.xyz/server4/" }
    ];

    urlMappings.forEach(({ search, replace }) => {
      search.forEach(s => {
        if (modifiedLink.includes(s)) {
          modifiedLink = modifiedLink.replace(s, replace);
        }
      });
    });

    modifiedLink = modifiedLink
      .replace(".mp4?bot=cscloud2bot&code=", "?ext=mp4&bot=cscloud2bot&code=")
      .replace(".mp4", "?ext=mp4")
      .replace(".mkv?bot=cscloud2bot&code=", "?ext=mkv&bot=cscloud2bot&code=")
      .replace(".mkv", "?ext=mkv")
      .replace(".zip", "?ext=zip");

    return modifiedLink;
  } catch (error) {
    console.error("❌ Scrape Error:", error.message);
    return url;
  }
}

// Get file size and final direct URL
async function fetchJsonData(data, url) {
  try {
    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const fileSize = $('p.file-info:contains("File Size") span').text().trim();
    response.data.fileSize = fileSize || "Unknown";
    return response.data;
  } catch (error) {
    console.error("❌ JSON Fetch Error:", error.message);
    return { error: error.message };
  }
}

// Command registration
cmd({
  pattern: "film",
  alias: ["movie"],
  use: ".film <movie name>",
  desc: "Search and download movies from Cinesubz",
  category: "search",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("🧐 Provide movie name.\n\n`.film Interstellar`");

    await m.react("🎥");
    const config = await readEnv();

    const hostnameLen = os.hostname().length;
    const hostname = hostnameLen === 12 ? "𝚁𝙴𝙿𝙻𝙸𝚃" : hostnameLen === 36 ? "𝙷𝙴𝚁𝙾𝙺𝚄" : hostnameLen === 8 ? "𝙺𝙾𝚈𝙴𝙱" : "𝚅𝙿𝚂";

    const bannerURL = "https://drive.google.com/uc?export=download&id=16ub1c6GS8fxBLEHfRdEvCa2jyLGChB1p";
    const watermark = "*ᴍᴏɴᴇʏ ʜᴇɪꜱᴛ ᴍᴅ*\n*~ ᴍʀ ᴅɪʟᴀ ᴏꜰᴄ*";

    const films = await getMovieDetailsAndDownloadLinks(q);
    if (films.length === 0) return reply("❌ No results found.");

    let msg = "🎬 *Search Results*\n\n_Reply with number to select_\n\n";
    films.forEach((film, i) => {
      msg += `${i + 1}. *${film.filmName}*\n`;
    });

    const listMsg = await conn.sendMessage(from, {
      image: { url: bannerURL },
      caption: `${msg}\n${watermark}`,
    }, { quoted: mek });

    conn.ev.once("messages.upsert", async (u) => {
      const res = u.messages[0];
      if (!res.message?.extendedTextMessage) return;
      const num = parseInt(res.message.extendedTextMessage.text.trim());
      if (isNaN(num) || num < 1 || num > films.length) return;

      const selectedFilm = films[num - 1];
      let info = `🎬 *${selectedFilm.filmName}* (${selectedFilm.year})\n⭐ IMDb: ${selectedFilm.imdb}\n📝 ${selectedFilm.description}\n\n_Reply with number to download:_\n`;

      const validLinks = selectedFilm.downloadLinks.filter(dl => !dl.quality.includes("Telegram"));
      const finalLinks = [];

      for (let i = 0; i < validLinks.length; i++) {
        const dl = validLinks[i];
        const modLink = await scrapeModifiedLink(dl.link);
        const file = await fetchJsonData({ direct: true }, modLink);
        if (file?.url) {
          finalLinks.push(file);
          info += `${i + 1}. *${dl.quality} - ${file.fileSize}*\n`;
        }
      }

      const infoMsg = await conn.sendMessage(from, {
        image: { url: selectedFilm.imageUrl },
        caption: `${info}\n${watermark}`
      }, { quoted: res });

      conn.ev.once("messages.upsert", async (u2) => {
        const res2 = u2.messages[0];
        const choice = parseInt(res2.message?.extendedTextMessage?.text.trim());
        const chosen = finalLinks[choice - 1];
        if (!chosen || !chosen.url) return reply("❌ Invalid choice.", res2);

        const sizeStr = chosen.fileSize;
        const sizeMB = parseFloat(sizeStr) * (sizeStr.includes("GB") ? 1024 : 1);
        if (["𝙷𝙴𝚁𝙾𝙺𝚄", "𝙺𝙾𝚈𝙴𝙱"].includes(hostname) || sizeMB > 2000) {
          return conn.sendMessage(from, { text: `🚫 File too large to send on ${hostname}. Try a lower quality.` }, { quoted: res2 });
        }

        await conn.sendMessage(from, {
          document: { url: chosen.url },
          fileName: `${selectedFilm.filmName}.mp4`,
          mimetype: "video/mp4",
          caption: `🎬 *${selectedFilm.filmName}*\n⭐ ${selectedFilm.imdb}\n📦 ${chosen.fileSize}\n\n📝 ${selectedFilm.description}\n\n${watermark}`
        }, { quoted: res2 });
      });
    });

  } catch (err) {
    console.error(err);
    reply("❌ Something went wrong.");
  }
});
