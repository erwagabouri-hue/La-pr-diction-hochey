const TelegramBot = require(“node-telegram-bot-api”);
const axios = require(“axios”);

const BOT_TOKEN = process.env.BOT_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!BOT_TOKEN) throw new Error(“BOT_TOKEN manquant dans les variables d’environnement”);
if (!ANTHROPIC_API_KEY) throw new Error(“ANTHROPIC_API_KEY manquant dans les variables d’environnement”);

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ─── État des conversations ───────────────────────────────────────────────────
const userState = {};

// ─── Menus clavier ────────────────────────────────────────────────────────────

const mainMenu = {
reply_markup: {
inline_keyboard: [
[
{ text: “🏠 Toiture”, callback_data: “menu_toiture” },
{ text: “⚡ Électricité”, callback_data: “menu_electricite” },
],
[{ text: “💬 Assistant IA libre”, callback_data: “menu_ia_libre” }],
],
},
};

const toitureMenu = {
reply_markup: {
inline_keyboard: [
[{ text: “🔩 Fixations & Structure”, callback_data: “toiture_fixations” }],
[{ text: “🪟 Pose des panneaux”, callback_data: “toiture_pose” }],
[{ text: “💧 Étanchéité & Infiltrations”, callback_data: “toiture_etancheite” }],
[{ text: “📐 Calepinage & Orientation”, callback_data: “toiture_calepinage” }],
[{ text: “🌬️ Vent & Charges mécaniques”, callback_data: “toiture_vent” }],
[{ text: “🔙 Retour au menu”, callback_data: “retour_menu” }],
],
},
};

const electriciteMenu = {
reply_markup: {
inline_keyboard: [
[{ text: “🟥 Huawei”, callback_data: “elec_huawei” }],
[{ text: “🟦 Atmoce”, callback_data: “elec_atmoce” }],
[{ text: “🟧 Enphase”, callback_data: “elec_enphase” }],
[{ text: “🔙 Retour au menu”, callback_data: “retour_menu” }],
],
},
};

const marqueBrandMenus = {
elec_huawei: {
label: “Huawei 🟥”,
keyboard: {
reply_markup: {
inline_keyboard: [
[{ text: “🔌 Onduleur ne démarre pas”, callback_data: “huawei_demarrage” }],
[{ text: “📉 Sous-production / erreur rendement”, callback_data: “huawei_rendement” }],
[{ text: “📡 Connexion SUN2000 / FusionSolar”, callback_data: “huawei_connexion” }],
[{ text: “⚠️ Codes d’erreur”, callback_data: “huawei_erreurs” }],
[{ text: “🔋 Batterie LUNA2000”, callback_data: “huawei_batterie” }],
[{ text: “🔙 Retour marques”, callback_data: “menu_electricite” }],
],
},
},
},
elec_atmoce: {
label: “Atmoce 🟦”,
keyboard: {
reply_markup: {
inline_keyboard: [
[{ text: “🔌 Onduleur ne démarre pas”, callback_data: “atmoce_demarrage” }],
[{ text: “📉 Sous-production”, callback_data: “atmoce_rendement” }],
[{ text: “📡 Communication & monitoring”, callback_data: “atmoce_connexion” }],
[{ text: “⚠️ Codes d’erreur”, callback_data: “atmoce_erreurs” }],
[{ text: “🔙 Retour marques”, callback_data: “menu_electricite” }],
],
},
},
},
elec_enphase: {
label: “Enphase 🟧”,
keyboard: {
reply_markup: {
inline_keyboard: [
[{ text: “🔌 Micro-onduleur ne répond pas”, callback_data: “enphase_demarrage” }],
[{ text: “📉 Module en sous-production”, callback_data: “enphase_rendement” }],
[{ text: “📡 Envoy & Enlighten app”, callback_data: “enphase_connexion” }],
[{ text: “⚠️ Codes d’erreur / LED”, callback_data: “enphase_erreurs” }],
[{ text: “🔋 IQ Battery / stockage”, callback_data: “enphase_batterie” }],
[{ text: “🔙 Retour marques”, callback_data: “menu_electricite” }],
],
},
},
},
};

// ─── Contextes IA pour chaque thème ──────────────────────────────────────────

const contextesIA = {
// Toiture
toiture_fixations:
“Tu es un expert en installation photovoltaïque. L’utilisateur a un problème avec les fixations et la structure de montage de panneaux solaires sur toiture. Aide-le avec des conseils précis sur les rails, crochets, boulons, et conformité des systèmes de fixation.”,
toiture_pose:
“Tu es un expert en installation photovoltaïque. L’utilisateur a une question sur la pose physique des panneaux solaires (manipulation, alignement, clips, espacements). Donne des conseils pratiques de terrain.”,
toiture_etancheite:
“Tu es un expert en installation photovoltaïque. L’utilisateur a un problème d’étanchéité ou d’infiltration d’eau lié à l’installation de panneaux solaires. Aide-le à diagnostiquer et résoudre le problème.”,
toiture_calepinage:
“Tu es un expert en installation photovoltaïque. L’utilisateur a besoin d’aide pour le calepinage, l’orientation, l’inclinaison ou la disposition optimale des panneaux solaires sur la toiture.”,
toiture_vent:
“Tu es un expert en installation photovoltaïque. L’utilisateur a une question sur les charges mécaniques, la résistance au vent, ou les normes de tenue des panneaux en conditions extrêmes.”,

// Huawei
huawei_demarrage:
“Tu es un technicien expert en onduleurs Huawei SUN2000. L’utilisateur a un problème de démarrage d’onduleur Huawei. Aide-le à diagnostiquer : vérification DC/AC, tension, interrupteurs, codes d’erreur courants.”,
huawei_rendement:
“Tu es un technicien expert en onduleurs Huawei SUN2000. L’utilisateur observe une sous-production ou une erreur de rendement. Guide-le dans le diagnostic : ombrage, MPPT, strings, paramètres FusionSolar.”,
huawei_connexion:
“Tu es un technicien expert en onduleurs Huawei SUN2000. L’utilisateur a des problèmes de connexion avec l’app SUN2000 ou FusionSolar. Aide-le avec le WiFi, Bluetooth, dongle 4G, ou configuration réseau.”,
huawei_erreurs:
“Tu es un technicien expert en onduleurs Huawei SUN2000. L’utilisateur a un code d’erreur affiché sur son onduleur Huawei. Demande-lui le code exact et explique sa signification et la solution.”,
huawei_batterie:
“Tu es un technicien expert en batteries Huawei LUNA2000. L’utilisateur a un problème avec son système de stockage LUNA2000. Aide-le sur l’installation, la communication, les modes de charge, les erreurs.”,

// Atmoce
atmoce_demarrage:
“Tu es un technicien expert en onduleurs Atmoce. L’utilisateur a un problème de démarrage d’onduleur Atmoce. Aide-le à diagnostiquer et résoudre le problème.”,
atmoce_rendement:
“Tu es un technicien expert en onduleurs Atmoce. L’utilisateur observe une sous-production. Guide-le dans le diagnostic des strings, MPPT, et paramètres de l’onduleur Atmoce.”,
atmoce_connexion:
“Tu es un technicien expert en onduleurs Atmoce. L’utilisateur a des problèmes de communication ou de monitoring avec son onduleur Atmoce. Aide-le à configurer la connexion.”,
atmoce_erreurs:
“Tu es un technicien expert en onduleurs Atmoce. L’utilisateur a un code d’erreur sur son onduleur Atmoce. Demande le code précis et guide-le vers la solution.”,

// Enphase
enphase_demarrage:
“Tu es un technicien expert en micro-onduleurs Enphase IQ. L’utilisateur a un micro-onduleur qui ne répond pas. Aide-le : vérification AC, communication Envoy, reset, remplacement.”,
enphase_rendement:
“Tu es un technicien expert en micro-onduleurs Enphase IQ. L’utilisateur a un module en sous-production. Guide-le sur Enlighten pour identifier le micro-onduleur défaillant.”,
enphase_connexion:
“Tu es un technicien expert en micro-onduleurs Enphase. L’utilisateur a des problèmes avec l’Envoy ou l’app Enlighten. Aide-le sur la configuration réseau, les mises à jour, les courbes de production.”,
enphase_erreurs:
“Tu es un technicien expert en micro-onduleurs Enphase IQ. L’utilisateur a des codes d’erreur ou des LEDs anormales sur ses équipements Enphase. Demande les détails et guide-le.”,
enphase_batterie:
“Tu es un technicien expert en systèmes de stockage Enphase IQ Battery. L’utilisateur a un problème avec sa batterie IQ. Aide-le sur l’installation, les modes, les erreurs et l’intégration Envoy.”,

ia_libre:
“Tu es SolarBot, un assistant expert en installation et dépannage de panneaux photovoltaïques. Tu as une connaissance approfondie des systèmes solaires résidentiels et commerciaux : onduleurs, câblage DC/AC, structures de montage, réglementation, optimisateurs, batteries, et monitoring. Réponds de manière claire et pratique aux questions du technicien.”,
};

// ─── Appel IA (Claude via Anthropic API) ─────────────────────────────────────

async function demanderIA(systemPrompt, historiqueMessages) {
const response = await axios.post(
“https://api.anthropic.com/v1/messages”,
{
model: “claude-sonnet-4-20250514”,
max_tokens: 1000,
system: systemPrompt,
messages: historiqueMessages,
},
{
headers: {
“Content-Type”: “application/json”,
“x-api-key”: ANTHROPIC_API_KEY,
“anthropic-version”: “2023-06-01”,
},
}
);
return response.data.content[0].text;
}

// ─── /start ───────────────────────────────────────────────────────────────────

bot.onText(//start/, (msg) => {
const chatId = msg.chat.id;
const prenom = msg.from.first_name || “technicien”;

userState[chatId] = { mode: null, marque: null, historique: [] };

bot.sendMessage(
chatId,
`☀️ *Bienvenue sur SolarBot, ${prenom} !*\n\n` +
`Je suis ton assistant intelligent pour les chantiers photovoltaïques.\n\n` +
`🔧 Je peux t'aider sur :\n` +
`• Les problèmes de *toiture* et de pose\n` +
`• Le dépannage *électrique* par marque\n` +
`• Toute question technique via l'IA\n\n` +
`👇 *Choisis une catégorie pour commencer :*`,
{ parse_mode: “Markdown”, …mainMenu }
);
});

// ─── Callback boutons ─────────────────────────────────────────────────────────

bot.on(“callback_query”, async (query) => {
const chatId = query.message.chat.id;
const data = query.data;

if (!userState[chatId]) userState[chatId] = { mode: null, marque: null, historique: [] };

bot.answerCallbackQuery(query.id);

// ── Menu principal ──
if (data === “retour_menu”) {
userState[chatId] = { mode: null, marque: null, historique: [] };
return bot.sendMessage(chatId, “🏠 *Menu principal* — Que veux-tu faire ?”, {
parse_mode: “Markdown”,
…mainMenu,
});
}

// ── Toiture ──
if (data === “menu_toiture”) {
return bot.sendMessage(
chatId,
“🏠 *Toiture* — Quel type de problème rencontres-tu ?”,
{ parse_mode: “Markdown”, …toitureMenu }
);
}

// ── Électricité → choix marque ──
if (data === “menu_electricite”) {
return bot.sendMessage(
chatId,
“⚡ *Électricité* — Sur quelle marque travailles-tu ?”,
{ parse_mode: “Markdown”, …electriciteMenu }
);
}

// ── IA libre ──
if (data === “menu_ia_libre”) {
userState[chatId].mode = “ia_libre”;
userState[chatId].historique = [];
return bot.sendMessage(
chatId,
“💬 *Mode IA libre activé*\n\nPose-moi n’importe quelle question technique sur le photovoltaïque. Je suis là pour t’aider ! 🔧\n\n_(Envoie /start pour revenir au menu)_”,
{ parse_mode: “Markdown” }
);
}

// ── Sous-menus marques ──
if (data in marqueBrandMenus) {
const marque = data;
userState[chatId].marqueMenu = marque;
const info = marqueBrandMenus[marque];
return bot.sendMessage(
chatId,
`${info.label} — Quel problème rencontres-tu ?`,
{ parse_mode: “Markdown”, …info.keyboard }
);
}

// ── Thèmes toiture ou électricité → activation IA ──
if (data in contextesIA) {
userState[chatId].mode = data;
userState[chatId].historique = [];

```
const labels = {
  toiture_fixations: "🔩 Fixations & Structure",
  toiture_pose: "🪟 Pose des panneaux",
  toiture_etancheite: "💧 Étanchéité & Infiltrations",
  toiture_calepinage: "📐 Calepinage & Orientation",
  toiture_vent: "🌬️ Vent & Charges mécaniques",
  huawei_demarrage: "🔌 Démarrage Huawei",
  huawei_rendement: "📉 Rendement Huawei",
  huawei_connexion: "📡 Connexion Huawei",
  huawei_erreurs: "⚠️ Erreurs Huawei",
  huawei_batterie: "🔋 Batterie LUNA2000",
  atmoce_demarrage: "🔌 Démarrage Atmoce",
  atmoce_rendement: "📉 Rendement Atmoce",
  atmoce_connexion: "📡 Connexion Atmoce",
  atmoce_erreurs: "⚠️ Erreurs Atmoce",
  enphase_demarrage: "🔌 Démarrage Enphase",
  enphase_rendement: "📉 Rendement Enphase",
  enphase_connexion: "📡 Connexion Enphase",
  enphase_erreurs: "⚠️ Erreurs Enphase",
  enphase_batterie: "🔋 Batterie IQ Enphase",
};

const label = labels[data] || data;
return bot.sendMessage(
  chatId,
  `✅ *${label}* — Décris-moi ton problème en détail :\n\n_(Je vais analyser et te donner une solution précise)_\n\n_(Envoie /start pour revenir au menu)_`,
  { parse_mode: "Markdown" }
);
```

}
});

// ─── Messages texte → IA ──────────────────────────────────────────────────────

bot.on(“message”, async (msg) => {
if (msg.text && msg.text.startsWith(”/”)) return;

const chatId = msg.chat.id;
const texte = msg.text;

if (!texte) return;

const state = userState[chatId];

if (!state || !state.mode) {
return bot.sendMessage(
chatId,
“👋 Utilise /start pour accéder au menu et choisir une catégorie avant de me poser ta question !”,
mainMenu
);
}

const systemPrompt = contextesIA[state.mode];
if (!systemPrompt) return;

// Ajouter au fil de conversation
state.historique.push({ role: “user”, content: texte });

// Indicateur de saisie
bot.sendChatAction(chatId, “typing”);

try {
const reponse = await demanderIA(systemPrompt, state.historique);
state.historique.push({ role: “assistant”, content: reponse });

```
// Garder l'historique raisonnable (10 derniers échanges)
if (state.historique.length > 20) {
  state.historique = state.historique.slice(-20);
}

bot.sendMessage(chatId, reponse, {
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [{ text: "🏠 Retour au menu principal", callback_data: "retour_menu" }],
    ],
  },
});
```

} catch (err) {
console.error(“Erreur IA :”, err.response?.data || err.message);
bot.sendMessage(
chatId,
“⚠️ Une erreur est survenue lors de la connexion à l’IA. Réessaie dans un instant.”,
mainMenu
);
}
});

console.log(“☀️ SolarBot démarré avec succès !”);