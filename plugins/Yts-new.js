const Commandyts = {
  pattern: "yts1",
  react: "🔎",
  alias: ["ytsearch", "ytfind"],
  desc: "Search YouTube and provide download options.",
  category: "search",
  use: ".yts <query>",
  filename: __filename
};

cmd(Commandyts, async (bot, message, fromData, {
  from, prefix, quoted, body, isCmd, command, args, q, sender, reply
}) => {
  try {
    if (!q) {
      return reply("Please provide a search term!");
    }

    // Fetch data from external JSON resource
    const response = await axios.get("ditels.json eka ඇඩ් කරන්න ඕනි ඒ කියන්නේ database");
    const footer = response.data.footer;

    // Perform YouTube search
    const searchResults = await yts(q);
    const videos = searchResults.videos;

    // Check if there are any search results
    if (!videos.length) {
      return reply("No results found.");
    }

    // Prepare the list of search results
    let videoList = [];
    for (let i = 0; i < videos.length; i++) {
      videoList.push({
        "title": i + 1,
        "description": `${videos[i].title}\n`,
        "rowId": `${prefix}ytselect ${videos[i].url}`
      });
    }

    // Structure the message to be sent back
    const messageBody = [{
      "title": "*[Results from YouTube.com]*\n",
      "rows": videoList
    }];

    const replyData = {
      text: `> CHAMA-MD-V1  𝗬𝗧𝗦 𝗦𝗘𝗔𝗥𝗖𝗛🔍\n\n🔎 *Search for:* *${q}*`,
      footer: footer,
      title: "Select a video from the results below:",
      buttonText: "🔢 Reply with a number",
      sections: messageBody
    };

    // Send the reply with options
    const quotedMessage = {
      quoted: message
    };

    return await bot.replyList(from, replyData, quotedMessage);

  } catch (error) {
    console.error(error);
    reply('Error: ' + error);
  }
});
