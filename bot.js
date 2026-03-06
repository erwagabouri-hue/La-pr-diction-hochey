const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;

const bot = new TelegramBot(token, { polling: true });

// Statistiques du bot
let wins = 0;
let losses = 0;

// Menu principal
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

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🏒 Bienvenue dans LA PRÉDICTION HOCKEY", menu);
});

// Obtenir la date du jour
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// Récupérer les matchs d’aujourd’hui (plusieurs ligues)
async function getTodayGames() {

  const today = getTodayDate();

  const leagues = [
    57, // NHL
    58, // AHL
    59, // Liiga
    60, // SHL
    61  // KHL
  ];

  let games = [];

  for (const league of leagues) {
    try {

      const response = await axios.get(
        `https://v1.hockey.api-sports.io/games?league=${league}&date=${today}`,
        {
          headers: {
            "x-apisports-key": apiKey
          }
        }
      );

      if (response.data.response.length > 0) {
        games = games.concat(response.data.response);
      }

    } catch (err) {}
  }

  return games;
}

// Récupérer les cotes d’un match
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

    const data = response.data.response;

    if (!data || data.length === 0) return null;

    const bookmaker = data[0].bookmakers[0];
    const bet = bookmaker.bets[0];

    const value = bet.values[Math.floor(Math.random() * bet.values.length)];

    return {
      bet: bet.name,
      value: value.value,
      odd: value.odd
    };

  } catch {
    return null;
  }
}

// Pari sûr 1.25–1.60
async function safeBet() {

  const games = await getTodayGames();

  for (const game of games) {

    const odds = await getOdds(game.id);

    if (!odds) continue;

    const oddValue = parseFloat(odds.odd);

    if (oddValue >= 1.25 && oddValue <= 1.60) {

      const home = game.teams.home.name;
      const away = game.teams.away.name;

      return `💰 PARI SÛR

${away} vs ${home}

Marché : ${odds.bet}
Pronostic : ${odds.value}

Cote : ${odds.odd}`;
    }
  }

  return "Aucun pari sûr trouvé aujourd’hui.";
}

// Combiné 3 matchs
async function comboBet() {

  const games = await getTodayGames();

  let message = "🔥 COMBINÉ 3 MATCHS\n\n";
  let total = 1;
  let count = 0;

  for (const game of games) {

    const odds = await getOdds(game.id);

    if (!odds) continue;

    const home = game.teams.home.name;
    const away = game.teams.away.name;

    const oddValue = parseFloat(odds.odd);

    if (oddValue > 1.20 && oddValue < 2.50) {

      message += `${away} vs ${home}
Marché : ${odds.bet}
Pronostic : ${odds.value}
Cote : ${odds.odd}

`;

      total *= oddValue;
      count++;

      if (count === 3) break;
    }
  }

  if (count < 3) return "Pas assez de matchs disponibles.";

  message += `🎯 COTE TOTALE : ${total.toFixed(2)}`;

  return message;
}

// Gestion des boutons
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
      "https://www.instagram.com/la_prediction777?igsh=MXJyNW82ajU3NDM4Yw%3D%3D&utm_source=qr"
    );
  }

  if (text === "🤖 Football & Basket bot") {

    bot.sendMessage(
      chatId,
      "https://t.me/PerfctIAbot?start=start"
    );
  }

});
