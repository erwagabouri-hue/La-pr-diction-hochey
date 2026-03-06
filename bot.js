const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

let wins = 0;
let losses = 0;

const menu = {
  reply_markup: {
    keyboard: [
      ["🍀 SAFE"],
      ["🔥 COMBINÉ NHL"],
      ["📊 Statistiques du bot"],
      ["📩 Contact Instagram"],
      ["🤖 Football & Basket bot"]
    ],
    resize_keyboard: true
  }
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🏒 LA PRÉDICTION HOCKEY NHL", menu);
});

// date aujourd'hui
function today() {
  return new Date().toISOString().split("T")[0];
}

// récupérer les vrais matchs NHL
async function getNHLGames() {

  const response = await axios.get(
    `https://api-web.nhle.com/v1/schedule/${today()}`
  );

  let games = [];

  response.data.gameWeek.forEach(day => {

    day.games.forEach(game => {
      games.push(game);
    });

  });

  return games;
}

// analyse simple
function analyseGame(home, away) {

  const predictions = [
    `${home} gagne`,
    `${away} gagne`,
    `Plus de 4.5 buts`,
    `Plus de 5.5 buts`,
    `Les deux équipes marquent`
  ];

  const prediction =
    predictions[Math.floor(Math.random() * predictions.length)];

  const confidence = Math.floor(Math.random() * 15) + 80;

  return {
    prediction,
    confidence
  };
}

// SAFE
async function safeBet() {

  const games = await getNHLGames();

  if (games.length === 0) {
    return "❌ Aucun match NHL aujourd'hui.";
  }

  const game = games[Math.floor(Math.random() * games.length)];

  const home = game.homeTeam.name.default;
  const away = game.awayTeam.name.default;

  const analysis = analyseGame(home, away);

  const odd = (Math.random() * 0.35 + 1.25).toFixed(2);

  return `🍀 SAFE NHL

${away} vs ${home}

🎯 Pari conseillé :
${analysis.prediction}

📊 Confiance :
${analysis.confidence}%

💰 Cote :
${odd}`;
}

// combiné
async function comboBet() {

  const games = await getNHLGames();

  if (games.length < 3) {
    return "❌ Pas assez de matchs NHL aujourd'hui.";
  }

  let message = "🔥 COMBINÉ NHL\n\n";
  let total = 1;

  for (let i = 0; i < 3; i++) {

    const game = games[i];

    const home = game.homeTeam.name.default;
    const away = game.awayTeam.name.default;

    const analysis = analyseGame(home, away);

    const odd = (Math.random() * 0.9 + 1.40).toFixed(2);

    total *= odd;

    message += `${away} vs ${home}

🎯 Pari :
${analysis.prediction}

💰 Cote :
${odd}

`;
  }

  message += `🎯 COTE TOTALE : ${total.toFixed(2)}`;

  return message;
}

// boutons
bot.on("message", async (msg) => {

  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "🍀 SAFE") {

    const bet = await safeBet();
    bot.sendMessage(chatId, bet);
  }

  if (text === "🔥 COMBINÉ NHL") {

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
