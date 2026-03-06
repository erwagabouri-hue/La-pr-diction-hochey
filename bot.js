const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

// MENU
const menu = {
  reply_markup: {
    keyboard: [
      ["📊 Pronostics du jour"],
      ["🔥 Matchs sûrs"],
      ["📈 Statistiques"],
      ["ℹ️ Aide"]
    ],
    resize_keyboard: true
  }
};

// Commande start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🏒 Bienvenue dans le bot de pronostics Hockey", menu);
});

// Boutons
bot.on("message", (msg) => {

  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === "📊 Pronostics du jour") {
    bot.sendMessage(chatId,
`🏒 Pronostics Hockey

Toronto Maple Leafs vs Rangers
✔️ Victoire Toronto

Canadiens vs Bruins
✔️ +4.5 buts

Avalanche vs Stars
✔️ Victoire Avalanche`);
  }

  if (text === "🔥 Matchs sûrs") {
    bot.sendMessage(chatId,
`🔥 Matchs sûrs

✔️ Edmonton Oilers gagne
✔️ Tampa Bay gagne
✔️ Over 5.5 buts`);
  }

  if (text === "📈 Statistiques") {
    bot.sendMessage(chatId,
`📈 Statistiques

Derniers pronostics :
✅ 7 gagnés
❌ 2 perdus

Précision : 78%`);
  }

  if (text === "ℹ️ Aide") {
    bot.sendMessage(chatId,
`ℹ️ Aide

Utilise les boutons pour voir les pronostics du jour.`);
  }

});
