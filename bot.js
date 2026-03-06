const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;

const bot = new TelegramBot(token, { polling: true });

let wins = 0;
let losses = 0;

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

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🏒 LA PRÉDICTION HOCKEY", menu);
});

function today() {
  return new Date().toISOString().split("T")[0];
}

async function getTodayGames() {

  const response = await axios.get(
    `https://v1.hockey.api-sports.io/games?date=${today()}`,
    {
      headers: {
        "x-apisports-key": apiKey
      }
    }
  );

  return response.data.response;
}

async function getOdds(gameId) {

  try {

    const response = await axios.get(
      `https://v1.hockey.api-sports.io/odds?game=${gameId}`,
      {
        headers: {
          "x-apisports-key": apiKey
        }
      }
    );

    const odds = response.data.response;

    if (!odds || odds.length === 0) return null;

    const bookmaker = odds[0].bookmakers[0];
    const bet = bookmaker.bets[0];
    const value = bet.values[0];

    return {
      market: bet.name,
      prediction: value.value,
      odd: value.odd
    };

  } catch {
    return null;
  }
}

async function safeBet() {

  const games = await getTodayGames();

  for (const game of games) {

    const odds = await getOdds(game.id);

    if (!odds) continue;

    const odd = parseFloat(odds.odd);

    if (odd >= 1.25 && odd <= 1.60) {

      return `💰 PARI SÛR

${game.teams.away.name} vs ${game.teams.home.name}

Marché : ${odds.market}
Pronostic : ${odds.prediction}

Cote : ${odds.odd}`;
    }
  }

  return "Aucun pari sûr aujourd'hui.";
}

async function comboBet() {

  const games = await getTodayGames();

  let total = 1;
  let message = "🔥 COMBINÉ 3 MATCHS\n\n";
  let count = 0;

  for (const game of games) {

    const odds = await getOdds(game.id);

    if (!odds) continue;

    const odd = parseFloat(odds.odd);

    if (odd >= 1.20 && odd <= 2.20) {

      message += `${game.teams.away.name} vs ${game.teams.home.name}
Marché : ${odds.market}
Pronostic : ${odds.prediction}
Cote : ${odds.odd}

`;

      total *= odd;
      count++;

      if (count === 3) break;
    }
  }

  if (count < 3) return "Pas assez de matchs disponibles aujourd'hui.";

  message += `🎯 COTE TOTALE : ${total.toFixed(2)}`;

  return message;
}

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
      "https://www.instagram.com/la_prediction777"
    );
  }

  if (text === "🤖 Football & Basket bot") {

    bot.sendMessage(
      chatId,
      "https://t.me/PerfctIAbot?start=start"
    );
  }

});
