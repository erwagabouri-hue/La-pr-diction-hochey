const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN manquant");

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "🏠 Toiture", callback_data: "menu_toiture" },
        { text: "⚡ Electricite", callback_data: "menu_electricite" }
      ],
      [
        { text: "📊 EMS", callback_data: "menu_ems" }
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

const emsMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🧠 EMMA (Huawei)", callback_data: "ems_emma" }],
      [{ text: "🔌 SHELLY", callback_data: "ems_shelly" }],
      [{ text: "🔙 Retour au menu", callback_data: "retour_menu" }]
    ]
  }
};

const emmaMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "⚙️ Installation & Mise en service", callback_data: "emma_installation" }],
      [{ text: "🔴 LED & Codes alarme", callback_data: "emma_led" }],
      [{ text: "📡 Connexion FusionSolar", callback_data: "emma_connexion" }],
      [{ text: "🔋 Gestion batterie & ESS", callback_data: "emma_batterie" }],
      [{ text: "🏠 Pilotage appareils (Shelly, PAC)", callback_data: "emma_pilotage" }],
      [{ text: "🔒 Mot de passe perdu", callback_data: "emma_password" }],
      [{ text: "🔙 Retour EMS", callback_data: "menu_ems" }]
    ]
  }
};

const shellyMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "📏 Shelly EM / 3EM (mesure)", callback_data: "shelly_3em" }],
      [{ text: "🔌 Shelly Pro 3EM (pro mesure)", callback_data: "shelly_pro3em" }],
      [{ text: "💡 Shelly 1PM / 2PM (pilotage)", callback_data: "shelly_1pm" }],
      [{ text: "🔧 Reset & Reconnexion WiFi", callback_data: "shelly_reset" }],
      [{ text: "📉 Mesures incorrectes", callback_data: "shelly_mesures" }],
      [{ text: "🔙 Retour EMS", callback_data: "menu_ems" }]
    ]
  }
};

const huaweiMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔌 Onduleur ne demarre pas", callback_data: "huawei_demarrage" }],
      [{ text: "📉 Sous-production / rendement", callback_data: "huawei_rendement" }],
      [{ text: "📡 Connexion SUN2000 FusionSolar", callback_data: "huawei_connexion" }],
      [{ text: "⚠️ Codes erreur LED", callback_data: "huawei_erreurs" }],
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
      [{ text: "⚠️ Codes erreur", callback_data: "atmoce_erreurs" }],
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
      [{ text: "⚠️ Codes LED erreur", callback_data: "enphase_erreurs" }],
      [{ text: "🔋 IQ Battery stockage", callback_data: "enphase_batterie" }],
      [{ text: "🔙 Retour marques", callback_data: "menu_electricite" }]
    ]
  }
};

const retourMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔙 Retour au menu principal", callback_data: "retour_menu" }]
    ]
  }
};

const reponses = {

  // ─── TOITURE ───────────────────────────────────────────────────
  toiture_fixations:
    "🔩 FIXATIONS & STRUCTURE\n\n" +
    "✅ Points a verifier :\n\n" +
    "1. Crochets tuile : adapter le crochet au type de tuile (mecanique, plate, ardoise). Chaque crochet fixe sur une latte saine, jamais dans le vide.\n\n" +
    "2. Rails : aluminium anodise, alignement au niveau. Espacement max entre crochets : 1,40 m.\n\n" +
    "3. Visserie : tout en inox A2 minimum (A4 en bord de mer). Serrage au couple recommande fabricant.\n\n" +
    "4. Etancheite des penetrations : mastic silicone neutre compatible tuile ou piece d etancheite fournie.\n\n" +
    "5. Charge admissible : panneaux standard = 15 a 20 kg/m2. Verifier que la charpente supporte. Si doute, faire verifier par un charpentier.\n\n" +
    "⚠️ Ne jamais poser sur une charpente degradee ou vermoulue.",

  toiture_pose:
    "🪟 POSE DES PANNEAUX\n\n" +
    "✅ Etapes cles :\n\n" +
    "1. Montage sur rail : glisser les brides milieu ou fin de serie. Ne pas serrer definitivement avant alignement de toute la rangee.\n\n" +
    "2. Espacement entre panneaux : minimum 10 mm pour la dilatation thermique.\n\n" +
    "3. Connexions DC : verifier la polarite (+ sur + et - sur -). Ne jamais connecter en charge (onduleur allume).\n\n" +
    "4. Passage des cables : clips de fixation sur le rail tous les 30 cm. Eviter les frottements sur les bords de tole.\n\n" +
    "5. Serrage final des brides : couple entre 8 et 12 Nm selon fabricant.\n\n" +
    "⚠️ Ne jamais marcher sur un panneau. Couvrir les panneaux (bache opaque) avant de brancher les DC.",

  toiture_etancheite:
    "💧 ETANCHEITE & INFILTRATIONS\n\n" +
    "✅ Diagnostic et solutions :\n\n" +
    "1. Infiltration au niveau des crochets : verifier que le mastic silicone est intact. Refaire avec silicone neutre UV resistant.\n\n" +
    "2. Tuile mal reposee : apres pose d un crochet, la tuile au-dessus doit recouvrir correctement.\n\n" +
    "3. Penetration de la sous-toiture : poser une piece d etancheite autour du crochet avant de river.\n\n" +
    "4. Condensation sous panneaux : normale en hiver. Verifier que la ventilation est suffisante (espace min 10 cm entre panneau et toiture).\n\n" +
    "5. Infiltration en about de rail : poser un bouchon d extremite sur les rails creux.",

  toiture_calepinage:
    "📐 CALEPINAGE & ORIENTATION\n\n" +
    "✅ Regles de base :\n\n" +
    "1. Orientation : plein Sud = production maximale. Sud-Est ou Sud-Ouest = perte 5 a 10%. Est ou Ouest = perte 20 a 30%.\n\n" +
    "2. Inclinaison optimale en France : 30 a 35 degres. En dessous de 15 degres : risque encrassement. Au-dessus de 60 degres : perte rendement ete.\n\n" +
    "3. Ombrage : un seul panneau ombre peut reduire toute la chaine de 50 a 80%. Verifier aux heures critiques (9h-15h).\n\n" +
    "4. Disposition : eviter de melanger des panneaux de puissances differentes sur la meme string.\n\n" +
    "5. Dimensionnement string : Voc panneau x nombre de panneaux en froid ne doit pas depasser la tension max DC de l onduleur.",

  toiture_vent:
    "🌬️ VENT & CHARGES MECANIQUES\n\n" +
    "✅ Points essentiels :\n\n" +
    "1. Zone de vent : France divisee en 4 zones (1 a 4). Verifier la zone du chantier sur la carte Eurocode 1.\n\n" +
    "2. Charges critiques : panneaux en bord de toiture et en angle = plus exposes. Renforcer les fixations dans ces zones.\n\n" +
    "3. Espacement des crochets : en zone 3 et 4, reduire a 1,20 m maximum. En zone littorale, visserie inox A4.\n\n" +
    "4. Garde au faitage : minimum 20 cm entre haut des panneaux et le faitage.\n\n" +
    "5. Note de calcul : pour installations importantes ou zones exposees, note de calcul signee par bureau d etudes recommandee.",

  // ─── HUAWEI ────────────────────────────────────────────────────
  huawei_demarrage:
    "🔌 HUAWEI SUN2000 - NE DEMARRE PAS\n\n" +
    "✅ Checklist :\n\n" +
    "1. Sectionneur DC sous l onduleur : position ON.\n\n" +
    "2. Sectionneurs DC dans le coffret de protection : tous ON.\n\n" +
    "3. Disjoncteur AC et differentiel dans le tableau : ON.\n\n" +
    "4. Tension DC : doit depasser le seuil minimum MPPT (generalement >200V). Mesurer entre PV+ et PV-.\n\n" +
    "5. Si affiche Arret Commande : FusionSolar > Mise en service > Maintenance > Onduleur ON/OFF > envoyer commande Demarrage.\n\n" +
    "6. Code reseau France : verifier que UTE C15-712-1 (A) est bien regle dans les parametres.\n\n" +
    "7. Premier demarrage : l onduleur a besoin de 5 minutes minimum pour verifier les protections.\n\n" +
    "⚠️ Ne jamais ouvrir un sectionneur DC quand l onduleur est en production.",

  huawei_rendement:
    "📉 HUAWEI - SOUS-PRODUCTION\n\n" +
    "✅ Causes et solutions :\n\n" +
    "1. Ombrage partiel : verifier cheminee, antenne ou arbre en milieu de journee.\n\n" +
    "2. Encrassement : panneaux sales = perte 10 a 25%. Nettoyer a l eau claire.\n\n" +
    "3. Alarme String : dans FusionSolar > Gestion des alarmes. Mesurer le courant de chaque string avec une pince.\n\n" +
    "4. MPPT mal configure : verifier que les plages de tension MPPT correspondent aux strings installees.\n\n" +
    "5. Firmware : verifier dans FusionSolar que le firmware est a jour.\n\n" +
    "6. Smart Meter deconnecte : verifier la connexion RS485. En cas de perte, l onduleur peut throttler la production.",

  huawei_connexion:
    "📡 HUAWEI - CONNEXION SUN2000 / FUSIONSOLAR\n\n" +
    "✅ Etapes :\n\n" +
    "1. Connexion WiFi directe : aller dans WiFi telephone, se connecter a SUN2000-XXXXXX. Mot de passe par defaut : Changeme.\n\n" +
    "2. App SUN2000 : mot de passe par defaut = 00000a. Selectionner Reglage rapide.\n\n" +
    "3. Connexion au routeur : FusionSolar > Mise en service > Parametres > Configuration communication > Connexion routeur.\n\n" +
    "4. FusionSolar cloud perdu : verifier que le WiFi de la maison fonctionne. Sans internet, l app ne fonctionne pas en mode cloud.\n\n" +
    "5. Dongle 4G : si pas de WiFi sur site, utiliser un Smart Dongle 4G Huawei sur le port USB de l onduleur.\n\n" +
    "6. Reset connexion : appuyer sur le bouton reset de l onduleur 3 secondes pour reinitialiser le mot de passe WiFi.",

  huawei_erreurs:
    "⚠️ HUAWEI - CODES ERREUR ET LED\n\n" +
    "✅ LED :\n" +
    "Rouge fixe = alarme majeure, onduleur arrete.\n" +
    "Rouge clignotant = probleme parametres AC ou Smart Meter.\n" +
    "Vert clignotant = demarrage ou fonctionnement normal.\n\n" +
    "✅ Codes courants :\n\n" +
    "- Isolation basse : probleme isolement cables DC ou panneau. Debrancher les strings une par une. Mesurer entre PV+ et terre, PV- et terre.\n\n" +
    "- Surtension reseau : tension EDF trop haute. L onduleur se protege. Contacter ENEDIS si recurrent.\n\n" +
    "- Frequence hors plage : verifier le reglage du code reseau.\n\n" +
    "- Smart Meter communication lost : verifier le branchement RS485.\n\n" +
    "- Arc CC (AFCI) : detection d arc sur cables DC. Inspecter tous les connecteurs MC4.",

  huawei_batterie:
    "🔋 HUAWEI LUNA2000\n\n" +
    "✅ Points de verification :\n\n" +
    "1. Demarrage : allumer d abord l onduleur SUN2000, puis l interrupteur auxiliaire de la batterie, puis l interrupteur principal.\n\n" +
    "2. Communication : cable de communication dedie entre LUNA2000 et SUN2000. Verifier branchement sur ports COM des deux appareils.\n\n" +
    "3. Batterie ne charge pas : verifier le SOC et le mode de charge dans FusionSolar.\n\n" +
    "4. Alarme batterie : noter le code exact. Les alarmes majeures necessitent une intervention SAV Huawei.\n\n" +
    "5. Temperature : LUNA2000 ne charge pas en dessous de 0C ou au-dessus de 50C.\n\n" +
    "6. Mise a jour : firmware mis a jour automatiquement via FusionSolar si connecte a internet.",

  // ─── ATMOCE ────────────────────────────────────────────────────
  atmoce_demarrage:
    "🔌 ATMOCE - ONDULEUR NE DEMARRE PAS\n\n" +
    "✅ Checklist :\n\n" +
    "1. Tension DC en entree : doit depasser le seuil de demarrage (generalement 150 a 200V).\n\n" +
    "2. Disjoncteur AC en aval : doit etre ferme.\n\n" +
    "3. Sectionneur DC : position ON.\n\n" +
    "4. Attendre 5 a 10 minutes : delai de demarrage automatique au lever du soleil.\n\n" +
    "5. Code reseau France : 50 Hz, limites de tension conformes a UTE C15-712.\n\n" +
    "6. Connecteurs DC : un MC4 mal enfiche peut empecher le demarrage. Verifier chaque connexion.\n\n" +
    "7. Si probleme persiste : noter le code d erreur affiche et contacter le support Atmoce.",

  atmoce_rendement:
    "📉 ATMOCE - SOUS-PRODUCTION\n\n" +
    "✅ Diagnostic :\n\n" +
    "1. Ombrage : meme une petite ombre sur un panneau impacte fortement toute une string.\n\n" +
    "2. Nettoyage : verifier fientes, poussiere, mousse sur les panneaux.\n\n" +
    "3. Strings via monitoring : comparer la production de chaque string. Une string en sous-production signale un probleme de panneau, connecteur ou cable.\n\n" +
    "4. Connecteurs MC4 : un connecteur oxyde ou mal enfiche cree une resistance supplementaire.\n\n" +
    "5. Temperature onduleur : si surchauffe, il reduit sa puissance. Verifier que les grilles de ventilation sont degagees.",

  atmoce_connexion:
    "📡 ATMOCE - COMMUNICATION & MONITORING\n\n" +
    "✅ Etapes :\n\n" +
    "1. Verifier la connexion WiFi ou ethernet entre l onduleur et le routeur.\n\n" +
    "2. Port de communication (RS485 ou WiFi) : doit etre bien configure dans les parametres onduleur.\n\n" +
    "3. Datalogger : verifier alimentation et cable RS485 (A sur A, B sur B).\n\n" +
    "4. Adresse IP : en cas de conflit d adresse sur le reseau local, le monitoring peut echouer.\n\n" +
    "5. Redemarrer le datalogger : couper l alimentation 30 secondes.\n\n" +
    "6. Configuration RS485 standard : 9600 bauds, 8 bits, 1 stop, pas de parite.",

  atmoce_erreurs:
    "⚠️ ATMOCE - CODES ERREUR\n\n" +
    "✅ Erreurs courantes :\n\n" +
    "- Isolement DC faible : inspecter cables, connecteurs et panneaux. Debrancher les strings une par une pour trouver le defaut.\n\n" +
    "- Erreur reseau AC : mesurer la tension au niveau de l onduleur. Si recurrent, contacter ENEDIS.\n\n" +
    "- Surtension DC : verifier que Voc x nombre de panneaux en froid ne depasse pas la tension max DC de l onduleur.\n\n" +
    "- Erreur temperature : surchauffe. Verifier la ventilation et l absence d obstruction.\n\n" +
    "⚠️ Toujours noter le code exact affiche sur l ecran avant d intervenir.",

  // ─── ENPHASE ───────────────────────────────────────────────────
  enphase_demarrage:
    "🔌 ENPHASE - MICRO-ONDULEUR NE REPOND PAS\n\n" +
    "✅ LED :\n" +
    "Vert fixe puis 6 clignotements verts = demarrage normal.\n" +
    "Clignotements rouges apres 2 min = pas de reseau AC. Verifier le disjoncteur AC.\n" +
    "Rouge fixe = resistance DC faible, probleme d isolement.\n\n" +
    "✅ Etapes :\n\n" +
    "1. Verifier le disjoncteur AC de la branche IQ Cable : ferme.\n\n" +
    "2. Tension AC au niveau du connecteur IQ Cable : doit etre 230V.\n\n" +
    "3. Deconnecter et reconnecter le connecteur DC du panneau. La LED doit s allumer en vert 6 secondes apres.\n\n" +
    "4. Si tout neuf et clignote rouge : doit etre configure via la passerelle IQ Gateway (Envoy). Sans passerelle, il ne produira pas.\n\n" +
    "5. Reset : couper le disjoncteur AC 10 minutes, puis le refermer. Attendre 5 minutes.",

  enphase_rendement:
    "📉 ENPHASE - MODULE EN SOUS-PRODUCTION\n\n" +
    "✅ Diagnostic via Enlighten :\n\n" +
    "1. Dans Enlighten ou app Enphase Installer : vue par micro-onduleur. Module en rouge ou orange = probleme identifie.\n\n" +
    "2. Comparer la production avec ses voisins de meme orientation. Ecart de plus de 20% = anormal.\n\n" +
    "3. Ombrage localise : verifier fiente, feuille ou objet sur le panneau.\n\n" +
    "4. Micro-onduleur defaillant : si les voisins produisent normalement et bon ensoleillement, le MO est probablement defaillant. Contacter Enphase pour RMA (garantie 25 ans).\n\n" +
    "5. Connecteur DC desserre : deconnecter/reconnecter les connecteurs DC (couper AC avant).\n\n" +
    "6. Probleme panneau : mesurer le Voc et le Isc directement. Si valeurs anormales, c est le panneau.",

  enphase_connexion:
    "📡 ENPHASE - ENVOY & ENLIGHTEN\n\n" +
    "✅ Resolution :\n\n" +
    "1. LED nuage rouge = pas d internet. Appuyer 1 seconde sur le bouton telephone de l Envoy, la LED 2 s allume en vert. Aller dans WiFi telephone > se connecter a Envoy_XXXXXX > configurer le nouveau WiFi domestique.\n\n" +
    "2. LED fleches rouge = l Envoy ne communique plus avec des micro-onduleurs. Communication par CPL. Verifier que l Envoy est branche pres du tableau.\n\n" +
    "3. Toutes LED clignotent rouge = l Envoy demarre. Normal moins de 60 minutes. Sinon couper et rallumer le disjoncteur 30 secondes.\n\n" +
    "4. Envoy fige : couper le disjoncteur de l Envoy 30 secondes puis rallumer.\n\n" +
    "5. Mise a jour : ne pas couper l alimentation pendant une mise a jour.",

  enphase_erreurs:
    "⚠️ ENPHASE - CODES LED ET ERREURS\n\n" +
    "✅ LED micro-onduleur :\n" +
    "Vert fixe (2 min) puis 6 clignotements verts = OK.\n" +
    "Clignotements rouges = pas de reseau AC ou configuration manquante.\n" +
    "Rouge fixe = isolement defaillant (< 7 kohms entre PV et terre).\n" +
    "Orange clignotant = configure mais Envoy absent.\n\n" +
    "✅ LED passerelle Envoy :\n" +
    "Nuage rouge = pas d internet.\n" +
    "Fleches rouge = pas de communication avec un ou plusieurs MO.\n" +
    "Eclair rouge = disjoncteur AC saute ou probleme production.\n\n" +
    "✅ Erreur resistance DC basse :\n" +
    "Mesurer entre PV+ et terre puis PV- et terre. Valeur normale = plusieurs megaohms. Si < 7 kohms : remplacer panneau ou micro-onduleur.",

  enphase_batterie:
    "🔋 ENPHASE IQ BATTERY\n\n" +
    "✅ Points de verification :\n\n" +
    "1. Communication : batterie IQ communique avec l Envoy via CPL. L Envoy doit etre branche pres du tableau.\n\n" +
    "2. Modes : Autoproduction (charge sur surplus solaire) ou Secours (reserve pour coupure reseau). Configurer dans Enlighten.\n\n" +
    "3. Batterie ne charge pas : verifier que l onduleur produit. Verifier mode de charge dans l app. Verifier SOC.\n\n" +
    "4. Batterie ne se decharge pas : verifier le mode de decharge. En mode Faible cout, decharge uniquement selon les plages tarifaires configurees.\n\n" +
    "5. Erreur dans Enlighten : noter le code d evenement. Les erreurs majeures = contacter support Enphase (garantie 10 ans).\n\n" +
    "6. Temperature : IQ Battery ne fonctionne pas en dessous de -10C. Installation en espace chauffe recommandee.",

  // ─── EMS - EMMA ───────────────────────────────────────────────
  emma_installation:
    "⚙️ EMMA HUAWEI - INSTALLATION & MISE EN SERVICE\n\n" +
    "✅ Modeles :\n" +
    "EMMA-A01 : gestion basique, jusqu a 10 appareils Shelly.\n" +
    "EMMA-A02 : version complete, jusqu a 20 appareils Shelly, 3 controleurs energie, 2 chargeurs VE, 1 pompe a chaleur.\n\n" +
    "✅ Etapes de mise en service :\n\n" +
    "1. Brancher l EMMA sur le reseau local via cable Ethernet (recommande) ou WiFi.\n\n" +
    "2. Alimenter en 230V monophase sur les bornes L et N.\n\n" +
    "3. Ouvrir FusionSolar > Mise en service > Ajouter appareil > EMMA. Scanner le QR code sur l appareil ou saisir le SN.\n\n" +
    "4. Verifier que l onduleur SUN2000 est bien detecte par l EMMA dans FusionSolar.\n\n" +
    "5. Configurer les appareils pilotes (Shelly, borne VE, PAC) dans FusionSolar > Gestion des appareils.\n\n" +
    "⚠️ L EMMA communique avec les Shelly via WiFi. Les Shelly doivent etre sur le meme reseau local.",

  emma_led:
    "🔴 EMMA - LED & CODES ALARME\n\n" +
    "✅ Signification des LED :\n\n" +
    "- LED verte fixe = fonctionnement normal, connexion cloud OK.\n" +
    "- LED verte clignotante = demarrage ou mise a jour en cours.\n" +
    "- LED rouge fixe = alarme active, connexion cloud perdue ou erreur materielle.\n" +
    "- LED rouge clignotante = probleme de communication avec FusionSolar ou avec un appareil pilote.\n" +
    "- LED eteinte = pas d alimentation. Verifier l alimentation 230V.\n\n" +
    "✅ Actions selon alarme :\n\n" +
    "- Alarme communication : verifier la connexion ethernet ou WiFi. Redemarrer le routeur et l EMMA.\n" +
    "- Alarme appareil : un appareil Shelly ou un equipement pilote ne repond plus. Verifier l alimentation et la connexion WiFi de l appareil en question.\n" +
    "- Alarme majeure : noter le code dans FusionSolar > Alarmes et contacter le SAV Huawei.",

  emma_connexion:
    "📡 EMMA - CONNEXION FUSIONSOLAR\n\n" +
    "✅ Diagnostic :\n\n" +
    "1. Verifier que l EMMA est bien connecte au routeur (cable ethernet recommande pour eviter les coupures WiFi).\n\n" +
    "2. Dans FusionSolar > Mon site > verifier que l EMMA apparait en ligne. Si hors ligne, il ne pilote plus rien.\n\n" +
    "3. Si l EMMA est en WiFi : verifier que le signal est suffisant (eviter les murs epais entre l EMMA et le routeur).\n\n" +
    "4. Redemarrer l EMMA : couper l alimentation 30 secondes puis rallumer. Attendre 3 minutes.\n\n" +
    "5. Mise a jour firmware : les mises a jour se font automatiquement. Ne pas couper l alimentation pendant la mise a jour (LED clignotante).\n\n" +
    "6. Reset usine : maintenir le bouton Reset 10 secondes. Attention : toute la configuration est perdue et il faut recommencer la mise en service.",

  emma_batterie:
    "🔋 EMMA - GESTION BATTERIE & ESS\n\n" +
    "✅ Modes de gestion :\n\n" +
    "1. Mode Maximiser autoproduction : EMMA charge la batterie avec le surplus solaire et la decharge quand la conso depasse la production.\n\n" +
    "2. Mode TOU (Time of Use) : EMMA charge la batterie en heures creuses (electricite moins chere) et decharge en heures pleines.\n\n" +
    "3. Mode Secours : EMMA maintient un niveau de charge minimum pour parer aux coupures reseau.\n\n" +
    "4. EMMA + LUNA2000 : l EMMA optimise les cycles de charge pour prolonger la duree de vie de la batterie.\n\n" +
    "5. Batterie ne charge pas via EMMA : verifier dans FusionSolar que le mode de gestion est bien configure et que l EMMA est en ligne.\n\n" +
    "6. EMMA + borne VE : mode Prochain voyage disponible. EMMA charge le VE en priorite sur surplus solaire selon l heure de depart configuree.",

  emma_pilotage:
    "🏠 EMMA - PILOTAGE APPAREILS\n\n" +
    "✅ Appareils compatibles EMMA-A02 :\n" +
    "- Jusqu a 20 appareils Shelly (prises, relais, variateurs)\n" +
    "- Jusqu a 3 controleurs d energie intelligents\n" +
    "- Jusqu a 2 bornes de recharge VE (SCharger Huawei)\n" +
    "- 1 pompe a chaleur compatible\n\n" +
    "✅ Ajouter un appareil Shelly :\n\n" +
    "1. Dans FusionSolar > Mon site > Gestion appareils > Ajouter un appareil intelligent.\n\n" +
    "2. Selectionner Shelly dans la liste. Saisir l adresse IP locale du Shelly.\n\n" +
    "3. Verifier que le Shelly est bien sur le meme reseau WiFi que l EMMA.\n\n" +
    "4. Configurer les scenes de pilotage : par exemple, activer le chauffe-eau quand la production depasse 2000W.\n\n" +
    "⚠️ L EMMA pilote les Shelly via leur API locale. Si le Shelly change d adresse IP, il faut le reconfigurer dans FusionSolar.",

  emma_password:
    "🔒 EMMA - MOT DE PASSE PERDU\n\n" +
    "✅ Reinitialiser le mot de passe installateur EMMA :\n\n" +
    "1. Dans FusionSolar > Mon site > Parametres > Securite > Reinitialiser mot de passe installateur.\n\n" +
    "2. Si l acces FusionSolar est impossible : maintenir le bouton Reset de l EMMA 10 secondes pour un reset usine complet.\n\n" +
    "⚠️ Attention : le reset usine efface TOUTE la configuration. Il faudra recommencer entierement la mise en service.\n\n" +
    "3. Mot de passe par defaut apres reset : verifier sur l etiquette de l appareil ou dans la documentation Huawei fournie avec l EMMA.\n\n" +
    "4. Si probleme de compte FusionSolar : contacter le support Huawei avec le numero de serie de l EMMA pour recuperer l acces.",

  // ─── EMS - SHELLY ─────────────────────────────────────────────
  shelly_3em:
    "📏 SHELLY EM / 3EM - MESURE DE PRODUCTION ET CONSO\n\n" +
    "✅ Usages en photovoltaique :\n\n" +
    "Shelly EM (1 gen) : 2 canaux. Un pour la mesure au Linky (conso/injection), un pour mesurer la production PV ou un circuit specifique.\n\n" +
    "Shelly 3EM : 3 pinces de courant. Ideal pour les installations triphasees. Mesure la puissance sur chaque phase.\n\n" +
    "✅ Installation correcte :\n\n" +
    "1. Placer les pinces de courant (tores) uniquement sur le cable de phase, jamais sur phase + neutre ensemble.\n\n" +
    "2. En monophase avec un 3EM : ponter les 3 entrees de tension A, B et C sur la meme phase. Obligatoire car c est la reference de tension pour le calcul de puissance.\n\n" +
    "3. Mettre un disjoncteur 2A a 10A entre le Linky et l alimentation du Shelly.\n\n" +
    "4. Orientation des tores : la puissance doit etre positive en consommation et negative en injection. Si inverse, retourner le tore de 180 degres.\n\n" +
    "5. Connexion Ethernet recommandee pour le Pro 3EM : evite les coupures WiFi et les pertes de donnees.",

  shelly_pro3em:
    "🔌 SHELLY PRO 3EM - MODELE PRO\n\n" +
    "✅ Caracteristiques cles :\n\n" +
    "- Mesure jusqu a 3 phases independamment\n" +
    "- Port Ethernet disponible (recommande pour la stabilite)\n" +
    "- Compatible Home Assistant, Jeedom, domotique via MQTT ou API locale\n" +
    "- Affichage en temps reel de la tension, puissance, cosinus phi\n" +
    "- Temperature interne normale : 45 a 55C en fonctionnement\n\n" +
    "✅ Branchement en monophase :\n\n" +
    "1. Ponter les bornes de tension A, B, C sur la phase unique.\n" +
    "2. Brancher une pince sur la phase du Linky, les autres sur les circuits a surveiller.\n\n" +
    "✅ Branchement en triphasé :\n\n" +
    "1. Brancher chaque phase (A, B, C) sur la borne correspondante.\n" +
    "2. Chaque pince sur la phase de meme lettre.\n\n" +
    "✅ Integration EMMA :\n" +
    "Le Shelly Pro 3EM peut etre pilote par l EMMA Huawei. Renseigner son adresse IP dans FusionSolar.",

  shelly_1pm:
    "💡 SHELLY 1PM / 2PM - PILOTAGE ET MESURE\n\n" +
    "✅ Usages en photovoltaique :\n\n" +
    "Shelly 1PM : relais 16A avec mesure de puissance. Ideal pour piloter un chauffe-eau, un radiateur ou tout appareil jusqu a 3500W.\n\n" +
    "Shelly 2PM : deux relais 16A independants. Pour piloter deux circuits.\n\n" +
    "Shelly 1PM Mini Gen 3 : version compacte, relais 8A. Pour les petits appareils.\n\n" +
    "✅ Configuration importante :\n\n" +
    "1. Dans les parametres du Shelly 1PM : changer le type de relais en mode Autonome. Ainsi le relais ne s active pas automatiquement au retour du courant apres une coupure.\n\n" +
    "2. Definir le comportement au demarrage : eteint par defaut recommande pour eviter les activations non desirees.\n\n" +
    "3. Scenes de pilotage : dans l app Shelly, creer une scene du type Si production > 2000W alors activer le Shelly 1PM.\n\n" +
    "4. Limite de courant : pour une borne de recharge VE en charge longue duree (16A toute la nuit), le Shelly 1PM seul peut surchauffer. Coupler avec un contacteur de puissance externe.",

  shelly_reset:
    "🔧 SHELLY - RESET & RECONNEXION WIFI\n\n" +
    "✅ Reset du Shelly :\n\n" +
    "1. Appuyer sur le bouton de reset pendant 10 secondes jusqu a ce que la LED clignote rapidement. Le Shelly repasse en point d acces WiFi (hotspot).\n\n" +
    "2. Si pas de bouton reset : alimenter le Shelly, dans les 60 secondes allumer et eteindre l interrupteur connecte 5 fois a intervalles reguliers.\n\n" +
    "✅ Reconnexion WiFi apres reset :\n\n" +
    "1. Dans le WiFi du telephone, chercher le reseau ShellyXXXX-XXXXXX.\n\n" +
    "2. Se connecter a ce reseau (pas de mot de passe).\n\n" +
    "3. Ouvrir l app Shelly ou aller sur 192.168.33.1 dans un navigateur.\n\n" +
    "4. Dans Settings > WiFi > configurer le reseau WiFi de la maison.\n\n" +
    "5. Le Shelly redemarrera et se connectera au reseau. L retrouver dans l app via la detection automatique.\n\n" +
    "⚠️ La LED rouge clignotante apres configuration = le Shelly n arrive pas a joindre le reseau WiFi configure. Verifier le SSID et le mot de passe.",

  shelly_mesures:
    "📉 SHELLY - MESURES INCORRECTES\n\n" +
    "✅ Causes frequentes et solutions :\n\n" +
    "1. Pinces mal orientees : si la valeur est negative alors que vous consommez, retourner la pince de 180 degres.\n\n" +
    "2. Pince sur phase + neutre ensemble : la pince doit etre uniquement sur le conducteur de phase. Si les deux sont dans la pince, les champs magnetiques s annulent et la mesure est fausse ou nulle.\n\n" +
    "3. En monophase avec 3EM : si les 3 entrees de tension ne sont pas pontees sur la meme phase, les mesures seront fausses.\n\n" +
    "4. Total journalier incorrect : en monophase avec un 3EM, le total global peut ne pas correspondre a la conso reelle si le cablage n est pas adapte. Utiliser un Shelly EM a la place pour les installations monophasees simples.\n\n" +
    "5. Decalage avec le compteur Linky : une difference de 1 a 3% est normale (precision des tores). Au-dela de 5%, verifier le cablage.\n\n" +
    "6. Consommation doublee : le Shelly compte peut-etre deux fois la meme chose. Verifier que les pinces ne sont pas sur des circuits qui se recoupent."
};

bot.onText(/\/start/, function(msg) {
  var chatId = msg.chat.id;
  var prenom = msg.from.first_name || "technicien";
  bot.sendMessage(
    chatId,
    "☀️ Bienvenue sur SolarBot, " + prenom + " !\n\nTon assistant pour les chantiers photovoltaiques.\n\n🔧 Toiture - Electricite - EMS\n\n👇 Choisis une categorie :",
    mainMenu
  );
});

bot.on("callback_query", function(query) {
  var chatId = query.message.chat.id;
  var data = query.data;
  bot.answerCallbackQuery(query.id);

  if (data === "retour_menu") {
    return bot.sendMessage(chatId, "🏠 Menu principal :", mainMenu);
  }
  if (data === "menu_toiture") {
    return bot.sendMessage(chatId, "🏠 Toiture - Quel probleme ?", toitureMenu);
  }
  if (data === "menu_electricite") {
    return bot.sendMessage(chatId, "⚡ Electricite - Quelle marque ?", electriciteMenu);
  }
  if (data === "menu_ems") {
    return bot.sendMessage(chatId, "📊 EMS - Quel systeme ?", emsMenu);
  }
  if (data === "ems_emma") {
    return bot.sendMessage(chatId, "🧠 EMMA Huawei - Quel probleme ?", emmaMenu);
  }
  if (data === "ems_shelly") {
    return bot.sendMessage(chatId, "🔌 SHELLY - Quel modele ou probleme ?", shellyMenu);
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
  if (reponses[data]) {
    return bot.sendMessage(chatId, reponses[data], retourMenu);
  }
});

bot.on("message", function(msg) {
  if (msg.text && msg.text.startsWith("/")) return;
  var chatId = msg.chat.id;
  bot.sendMessage(chatId, "👇 Utilise le menu pour choisir ton probleme :", mainMenu);
});

console.log("☀️ SolarBot demarre - Toiture / Electricite / EMS !");
