const TelegramBot = require("node-telegram-bot-api");
const { Post } = require("./src/model");
const handler = require("./src/handlerWallPosts");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  // polling: true,
  webHook: { port: process.env.PORT },
});

const urlWebHook = `${process.env.APP_URL || process.env.HOST}/bot${
  process.env.BOT_TOKEN
}`;
console.log(`urlWebHook: ${urlWebHook}`);

bot.setWebHook(urlWebHook);

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const idPost = handler.getIdPost(msg.text);

  idPost &&
    handler.getPost(idPost, (err, results) => {
      if (!err) {
        const tmpPost = new Post(results);
        if (tmpPost.attachments.length) {
          bot.deleteMessage(chatId, msg.message_id);
          bot.sendMediaGroup(chatId, tmpPost.attachments);
        } else bot.sendMessage(chatId, tmpPost.text);
      }
    });
});

// bot.onText(/\/p (.+)/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   // bot.sendMessage(chatId, resp);
// });

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });
