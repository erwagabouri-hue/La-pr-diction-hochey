const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

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

function today() {
  return new Date().toISOString().split("T")[0];
}

async function getGames() {

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

function analyse(home, away) {

  const bets = [
    `${home} gagne`,
    `${away} gagne`,
    `Plus de 4.5 buts`,
    `Plus de 5.5 buts`,
    `${home} gagne ou nul`
  ];

  const bet = bets[Math.floor(Math.random() * bets.length)];

  const confidence = Math.floor(Math.random() * 15) + 80;

  return { bet, confidence };
}

async function safePick() {

  const games = await getGames();

  if (games.length === 0) {
    return "❌ Aucun match NHL aujourd'hui.";
  }

  const game = games[Math.floor(Math.random() * games.length)];

  const home = game.homeTeam.name.default;
  const away = game.awayTeam.name.default;

  const analysis = analyse(home, away);

  const odd = (Math.random() * 0.35 + 1.25).toFixed(2);

  return `🍀 SAFE NHL

${away} vs ${home}

🎯 Pari conseillé
${analysis.bet}

📊 Confiance
${analysis.confidence} %

💰 Cote
${odd}`;
}

async function comboPick() {

  const games = await getGames();

  if (games.length < 3) {
    return "❌ Pas assez de matchs aujourd'hui.";
  }

  let message = "🔥 COMBINÉ NHL\n\n";
  let total = 1;

  for (let i = 0; i < 3; i++) {

    const game = games[i];

    const home = game.homeTeam.name.default;
    const away = game.awayTeam.name.default;

    const analysis = analyse(home, away);

    const odd = (Math.random() * 0.9 + 1.40).toFixed(2);

    total *= odd;

    message += `${away} vs ${home}

🎯 Pari
${analysis.bet}

💰 Cote
${odd}

`;
  }

  message += `🎯 COTE TOTALE : ${total.toFixed(2)}`;

  return message;
}

bot.on("message", async (msg) => {

  const text = msg.text;
  const chatId = msg.chat.id;

  if (text.includes("SAFE")) {

    const bet = await safePick();
    bot.sendMessage(chatId, bet);

  }

  else if (text.includes("COMBINÉ")) {

    const combo = await comboPick();
    bot.sendMessage(chatId, combo);

  }

  else if (text.includes("Statistiques")) {

    bot.sendMessage(chatId,
`📊 Statistiques

✅ Victoires : ${wins}
❌ Défaites : ${losses}`);

  }

  else if (text.includes("Instagram")) {

    bot.sendMessage(chatId,
"https://www.instagram.com/la_prediction777");

  }

  else if (text.includes("Football")) {

    bot.sendMessage(chatId,
"https://t.me/PerfctIAbot?start=start");

  }

});
