const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN manquant");
if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY manquant");

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const userState = {};

const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "🏠 Toiture", callback_data: "menu_toiture" },
        { text: "⚡ Electricite", callback_data: "menu_electricite" }
      ],
      [
        { text: "💬 Assistant IA libre", callback_data: "menu_ia_libre" }
      ]
    ]
  }
};

const toitureMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔩 Fixations & Structure", callback_data: "toiture_fixations" }],
      [{ text: "🪟 Pose des panneaux", callback_data: "toiture_pose" }],
      [{ text: "💧 Etancheite & Infiltrations", callback_data: "toiture_etancheite" }],
      [{ text: "📐 Calepinage & Orientation", callback_data: "toiture_calepinage" }],
      [{ text: "🌬️ Vent & Charges mecaniques", callback_data: "toiture_vent" }],
      [{ text: "🔙 Retour au menu", callback_data: "retour_menu" }]
    ]
  }
};

const electriciteMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🟥 Huawei", callback_data: "elec_huawei" }],
      [{ text: "🟦 Atmoce", callback_data: "elec_atmoce" }],
      [{ text: "🟧 Enphase", callback_data: "elec_enphase" }],
      [{ text: "🔙 Retour au menu", callback_data: "retour_menu" }]
    ]
  }
};

const huaweiMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔌 Onduleur ne demarre pas", callback_data: "huawei_demarrage" }],
      [{ text: "📉 Sous-production / rendement", callback_data: "huawei_rendement" }],
      [{ text: "📡 Connexion SUN2000 FusionSolar", callback_data: "huawei_connexion" }],
      [{ text: "⚠️ Codes d erreur", callback_data: "huawei_erreurs" }],
      [{ text: "🔋 Batterie LUNA2000", callback_data: "huawei_batterie" }],
      [{ text: "🔙 Retour marques", callback_data: "menu_electricite" }]
    ]
  }
};

const atmoceMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔌 Onduleur ne demarre pas", callback_data: "atmoce_demarrage" }],
      [{ text: "📉 Sous-production", callback_data: "atmoce_rendement" }],
      [{ text: "📡 Communication et monitoring", callback_data: "atmoce_connexion" }],
      [{ text: "⚠️ Codes d erreur", callback_data: "atmoce_erreurs" }],
      [{ text: "🔙 Retour marques", callback_data: "menu_electricite" }]
    ]
  }
};

const enphaseMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔌 Micro-onduleur ne repond pas", callback_data: "enphase_demarrage" }],
      [{ text: "📉 Module en sous-production", callback_data: "enphase_rendement" }],
      [{ text: "📡 Envoy et Enlighten app", callback_data: "enphase_connexion" }],
      [{ text: "⚠️ Codes d erreur et LED", callback_data: "enphase_erreurs" }],
      [{ text: "🔋 IQ Battery stockage", callback_data: "enphase_batterie" }],
      [{ text: "🔙 Retour marques", callback_data: "menu_electricite" }]
    ]
  }
};

const contextesIA = {
  toiture_fixations: "Tu es un expert en installation photovoltaique. Aide sur les fixations et la structure de montage. Conseils sur rails, crochets, boulons, conformite.",
  toiture_pose: "Tu es un expert en installation photovoltaique. Aide sur la pose physique des panneaux solaires. Conseils pratiques de terrain.",
  toiture_etancheite: "Tu es un expert en installation photovoltaique. Aide sur les problemes d etancheite ou infiltration d eau. Diagnostic et solutions.",
  toiture_calepinage: "Tu es un expert en installation photovoltaique. Aide sur le calepinage, l orientation et la disposition optimale des panneaux.",
  toiture_vent: "Tu es un expert en installation photovoltaique. Aide sur les charges mecaniques et la resistance au vent des panneaux.",
  huawei_demarrage: "Tu es technicien expert en onduleurs Huawei SUN2000. Aide sur les problemes de demarrage. Diagnostic DC/AC, tension, interrupteurs.",
  huawei_rendement: "Tu es technicien expert en onduleurs Huawei SUN2000. Aide sur les problemes de sous-production. Diagnostic ombrage, MPPT, strings, FusionSolar.",
  huawei_connexion: "Tu es technicien expert en onduleurs Huawei SUN2000. Aide sur la connexion SUN2000 et FusionSolar. WiFi, Bluetooth, dongle 4G.",
  huawei_erreurs: "Tu es technicien expert en onduleurs Huawei SUN2000. Aide sur les codes d erreur. Demande le code exact et explique la solution.",
  huawei_batterie: "Tu es technicien expert en batteries Huawei LUNA2000. Aide sur installation, communication, modes de charge, erreurs.",
  atmoce_demarrage: "Tu es technicien expert en onduleurs Atmoce. Aide sur les problemes de demarrage. Diagnostic et solutions.",
  atmoce_rendement: "Tu es technicien expert en onduleurs Atmoce. Aide sur les problemes de sous-production.",
  atmoce_connexion: "Tu es technicien expert en onduleurs Atmoce. Aide sur les problemes de communication et monitoring.",
  atmoce_erreurs: "Tu es technicien expert en onduleurs Atmoce. Aide sur les codes d erreur. Demande le code et guide vers la solution.",
  enphase_demarrage: "Tu es technicien expert en micro-onduleurs Enphase IQ. Aide sur les micro-onduleurs qui ne repondent pas. AC, Envoy, reset.",
  enphase_rendement: "Tu es technicien expert en micro-onduleurs Enphase IQ. Aide sur les modules en sous-production via Enlighten.",
  enphase_connexion: "Tu es technicien expert en micro-onduleurs Enphase. Aide sur les problemes Envoy et Enlighten. Configuration reseau.",
  enphase_erreurs: "Tu es technicien expert en micro-onduleurs Enphase IQ. Aide sur les codes d erreur et LEDs anormales.",
  enphase_batterie: "Tu es technicien expert en batteries Enphase IQ Battery. Aide sur installation, modes, erreurs et integration Envoy.",
  ia_libre: "Tu es SolarBot, assistant expert en installation et depannage de panneaux photovoltaiques. Connaissance approfondie : onduleurs, cablage DC/AC, structures, reglementation, optimisateurs, batteries, monitoring. Reponds clairement et pratiquement."
};

const labels = {
  toiture_fixations: "🔩 Fixations & Structure",
  toiture_pose: "🪟 Pose des panneaux",
  toiture_etancheite: "💧 Etancheite",
  toiture_calepinage: "📐 Calepinage",
  toiture_vent: "🌬️ Vent & Charges",
  huawei_demarrage: "🔌 Demarrage Huawei",
  huawei_rendement: "📉 Rendement Huawei",
  huawei_connexion: "📡 Connexion Huawei",
  huawei_erreurs: "⚠️ Erreurs Huawei",
  huawei_batterie: "🔋 Batterie LUNA2000",
  atmoce_demarrage: "🔌 Demarrage Atmoce",
  atmoce_rendement: "📉 Rendement Atmoce",
  atmoce_connexion: "📡 Connexion Atmoce",
  atmoce_erreurs: "⚠️ Erreurs Atmoce",
  enphase_demarrage: "🔌 Demarrage Enphase",
  enphase_rendement: "📉 Rendement Enphase",
  enphase_connexion: "📡 Connexion Enphase",
  enphase_erreurs: "⚠️ Erreurs Enphase",
  enphase_batterie: "🔋 Batterie IQ Enphase",
  ia_libre: "💬 Assistant IA libre"
};

async function demanderIA(systemPrompt, historique) {
  var contents = historique.map(function(m) {
    return {
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    };
  });
  var response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
    {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: contents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7
      }
    },
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  return response.data.candidates[0].content.parts[0].text;
}

bot.onText(/\/start/, function(msg) {
  var chatId = msg.chat.id;
  var prenom = msg.from.first_name || "technicien";
  userState[chatId] = { mode: null, historique: [] };
  bot.sendMessage(
    chatId,
    "☀️ Bienvenue sur SolarBot, " + prenom + " !\n\nJe suis ton assistant pour les chantiers photovoltaiques.\n\n🔧 Je peux t aider sur :\n- Toiture et pose\n- Depannage electrique par marque\n- Questions techniques via l IA\n\n👇 Choisis une categorie :",
    mainMenu
  );
});

bot.on("callback_query", async function(query) {
  var chatId = query.message.chat.id;
  var data = query.data;
  if (!userState[chatId]) userState[chatId] = { mode: null, historique: [] };
  bot.answerCallbackQuery(query.id);
  if (data === "retour_menu") {
    userState[chatId] = { mode: null, historique: [] };
    return bot.sendMessage(chatId, "🏠 Menu principal :", mainMenu);
  }
  if (data === "menu_toiture") {
    return bot.sendMessage(chatId, "🏠 Toiture - Quel probleme ?", toitureMenu);
  }
  if (data === "menu_electricite") {
    return bot.sendMessage(chatId, "⚡ Electricite - Quelle marque ?", electriciteMenu);
  }
  if (data === "menu_ia_libre") {
    userState[chatId].mode = "ia_libre";
    userState[chatId].historique = [];
    return bot.sendMessage(chatId, "💬 Mode IA libre active ! Pose ta question sur le photovoltaique.\n\n(/start pour le menu)");
  }
  if (data === "elec_huawei") {
    return bot.sendMessage(chatId, "🟥 Huawei - Quel probleme ?", huaweiMenu);
  }
  if (data === "elec_atmoce") {
    return bot.sendMessage(chatId, "🟦 Atmoce - Quel probleme ?", atmoceMenu);
  }
  if (data === "elec_enphase") {
    return bot.sendMessage(chatId, "🟧 Enphase - Quel probleme ?", enphaseMenu);
  }
  if (contextesIA[data]) {
    userState[chatId].mode = data;
    userState[chatId].historique = [];
    var label = labels[data] || data;
    return bot.sendMessage(chatId, "✅ " + label + "\n\nDecris ton probleme en detail :\n\n(/start pour le menu)");
  }
});

bot.on("message", async function(msg) {
  if (msg.text && msg.text.startsWith("/")) return;
  var chatId = msg.chat.id;
  var texte = msg.text;
  if (!texte) return;
  var state = userState[chatId];
  if (!state || !state.mode) {
    return bot.sendMessage(chatId, "👋 Utilise /start pour choisir une categorie !", mainMenu);
  }
  var systemPrompt = contextesIA[state.mode];
  if (!systemPrompt) return;
  state.historique.push({ role: "user", content: texte });
  bot.sendChatAction(chatId, "typing");
  try {
    var reponse = await demanderIA(systemPrompt, state.historique);
    state.historique.push({ role: "assistant", content: reponse });
    if (state.historique.length > 20) state.historique = state.historique.slice(-20);
    bot.sendMessage(chatId, reponse, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🏠 Retour au menu", callback_data: "retour_menu" }]
        ]
      }
    });
  } catch (err) {
    console.error("Erreur IA :", err.message);
    bot.sendMessage(chatId, "⚠️ Erreur IA. Reessaie dans un instant.", mainMenu);
  }
});

console.log("☀️ SolarBot demarre avec Gemini !");
