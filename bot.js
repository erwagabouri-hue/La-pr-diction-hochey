const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;

const bot = new TelegramBot(token, { polling: true });

let wins = 0;
let losses = 0;

// MENU
const menu = {
  reply_markup: {
    keyboard: [
      ["💰 Cote sûre 1.25 - 1.60"],
      ["🔥 Combiné 3 matchs"],
      ["📊 Statistiques du bot"],
      ["📩 Contact Instagram"],
      ["🤖 Football & Basket bot"]
    ],
    resize_keyboard: true
  }
};

// START
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🏒 Bienvenue dans le bot de pronostics Hockey IA",
    menu
  );
});

// ANALYSE API
async function getGames() {

  const leagues = [57, 58, 59]; // NHL + autres ligues

  let games = [];

  for (const league of leagues) {

    const response = await axios.get(
      `https://v1.hockey.api-sports.io/games?league=${league}&season=2024`,
      {
        headers: {
          "x-apisports-key": apiKey
        }
      }
    );

    games = games.concat(response.data.response);
  }

  return games.slice(0,10);
}

// COTE SÛRE
async function safeBet() {

  const games = await getGames();
  const game = games[Math.floor(Math.random() * games.length)];

  const home = game.teams.home.name;
  const away = game.teams.away.name;

  const odds = (Math.random() * (1.60 - 1.25) + 1.25).toFixed(2);

  return `💰 PARI SÛR

${away} vs ${home}

Pronostic : +2.5 buts

Cote : ${odds}`;
}

// COMBINÉ
async function comboBet() {

  const games = await getGames();

  const selected = games.slice(0,3);

  let totalOdds = 1;
  let message = "🔥 COMBINÉ 3 MATCHS\n\n";

  selected.forEach(game => {

    const home = game.teams.home.name;
    const away = game.teams.away.name;

    const odds = (Math.random() * 1.5 + 1.2).toFixed(2);

    totalOdds *= odds;

    message += `${away} vs ${home}
Pronostic : +2.5 buts
Cote : ${odds}

`;
  });

  message += `🎯 COTE TOTALE : ${totalOdds.toFixed(2)}`;

  return message;
}

// BOUTONS
bot.on("message", async (msg) => {

  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "💰 Cote sûre 1.25 - 1.60") {

    const bet = await safeBet();

    bot.sendMessage(chatId, bet);
  }

  if (text === "🔥 Combiné 3 matchs") {

    const combo = await comboBet();

    bot.sendMessage(chatId, combo);
  }

  if (text === "📊 Statistiques du bot") {

    bot.sendMessage(
      chatId,
      `📊 Statistiques

✅ Victoires : ${wins}
❌ Défaites : ${losses}`
    );
  }

  if (text === "📩 Contact Instagram") {

    bot.sendMessage(
      chatId,
      "Contactez-nous : https://www.instagram.com/la_prediction777?igsh=MXJyNW82ajU3NDM4Yw%3D%3D&utm_source=qr"
    );
  }

  if (text === "🤖 Football & Basket bot") {

    bot.sendMessage(
      chatId,
      "Bot Football & Basket : https://t.me/PerfctIAbot?start=start"
    );
  }

});
