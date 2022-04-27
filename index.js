const TelegramBot = require("node-telegram-bot-api");
const { Post } = require("./src/model");
const handler = require("./src/handlerWallPosts");

const regExpPostVk = new RegExp("vk\\.com/wall-\\d+_\\d+$");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  // polling: true,
  webHook: { port: process.env.PORT },
});

bot.setWebHook(`${process.env.APP_URL || process.env.HOST}/bot${process.env.BOT_TOKEN}`);

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (!regExpPostVk.test(msg.text.trim())) return;
  const idPost = handler.getIdPost(msg.text);

  idPost &&
    handler.getPost(idPost, async (err, results) => {
      if (!err) {
        const tmpPost = new Post(results, msg.text);
        const isAttachments = !!tmpPost.attachments.length;
        bot.deleteMessage(chatId, msg.message_id);
        if (isAttachments) await bot.sendMediaGroup(chatId, tmpPost.attachments);
        // отправка доп. длинного текста или просто текста
        if (!tmpPost.subText.length) return;
        for (let i = isAttachments ? 1 : 0; i < tmpPost.subText.length; i++) {
          const element = tmpPost.subText[i];
          if (!element) continue;
          bot.sendMessage(chatId, element);
        }
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
