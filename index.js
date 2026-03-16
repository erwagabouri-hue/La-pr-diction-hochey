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
    "1. Crochets tuile : verifier que le crochet est adapte au type de tuile (mecanique, plate, ardoise). Chaque crochet doit etre fixe sur une latte saine, jamais dans le vide.\n\n" +
    "2. Rails : utiliser des rails en aluminium anodise. Verifier l alignement avec un niveau. Espacement max entre crochets : 1,40 m.\n\n" +
    "3. Boulons et visserie : tout doit etre en inox A2 minimum (A4 en bord de mer). Serrage au couple recommande par le fabricant.\n\n" +
    "4. Etancheite des penetrations : chaque crochet traversant doit etre scelle avec du mastic silicone neutre compatible tuile ou avec une piece d etancheite fournie.\n\n" +
    "5. Charge admissible : verifier que la charpente peut supporter le poids. Panneaux standard = 15 a 20 kg/m2. En cas de doute, faire verifier par un charpentier.\n\n" +
    "⚠️ Ne jamais poser sur une charpente degradee ou vermoulue.",

  toiture_pose:
    "🪟 POSE DES PANNEAUX\n\n" +
    "✅ Etapes cles :\n\n" +
    "1. Montage sur rail : glisser les brides milieu ou fin de serie selon la position. Ne pas serrer definitivement avant d avoir aligne toute la rangee.\n\n" +
    "2. Espacement entre panneaux : minimum 10 mm pour la dilatation thermique. Ne pas bloquer trop serre.\n\n" +
    "3. Connexions DC : brancher les connecteurs MC4 en verifiant la polarite (+ sur + et - sur -). Ne jamais connecter en charge (onduleur allume).\n\n" +
    "4. Passage des cables : utiliser des clips de fixation sur le rail tous les 30 cm. Eviter les frottements sur les bords de tole.\n\n" +
    "5. Serrage final des brides : couple de serrage generalement entre 8 et 12 Nm selon fabricant.\n\n" +
    "⚠️ Ne jamais marcher sur un panneau. Toujours couvrir les panneaux (bache opaque) avant de brancher les DC.",

  toiture_etancheite:
    "💧 ETANCHEITE & INFILTRATIONS\n\n" +
    "✅ Diagnostic et solutions :\n\n" +
    "1. Infiltration au niveau des crochets : cause la plus frequente. Verifier que le mastic silicone est intact et qu il n y a pas de fissure autour du crochet. Refaire l etancheite avec silicone neutre UV resistant.\n\n" +
    "2. Tuile mal reposee : apres pose d un crochet, la tuile au-dessus doit recouvrir correctement. Verifier qu il n y a pas de pont entre deux tuiles.\n\n" +
    "3. Penetration de la sous-toiture : si la sous-toiture est percee, poser une piece d etancheite autour du crochet avant de river.\n\n" +
    "4. Condensation sous panneaux : normale en hiver. Si l eau ruisselle en grande quantite, verifier que la ventilation sous panneau est suffisante (espace min 10 cm entre panneau et toiture).\n\n" +
    "5. Infiltration en about de rail : poser un bouchon d extremite sur les rails creux pour eviter que l eau s infiltre et gele.",

  toiture_calepinage:
    "📐 CALEPINAGE & ORIENTATION\n\n" +
    "✅ Regles de base :\n\n" +
    "1. Orientation : plein Sud = production maximale. Sud-Est ou Sud-Ouest = perte d environ 5 a 10%. Est ou Ouest = perte de 20 a 30%.\n\n" +
    "2. Inclinaison optimale en France : entre 30 et 35 degres. En dessous de 15 degres : risque d encrassement. Au-dessus de 60 degres : perte de rendement ete.\n\n" +
    "3. Ombrage : un seul panneau ombre peut reduire toute la chaine de 50 a 80%. Verifier les masques solaires (cheminee, velux, antenne, arbre) aux heures critiques (9h-15h).\n\n" +
    "4. Disposition : panneaux en portrait ou paysage selon la charpente. Eviter de melanger des panneaux de puissances differentes sur la meme string.\n\n" +
    "5. Dimensionnement string : tension string en froid ne doit pas depasser la tension max DC de l onduleur. Verifier avec Voc panneau x nombre de panneaux.",

  toiture_vent:
    "🌬️ VENT & CHARGES MECANIQUES\n\n" +
    "✅ Points essentiels :\n\n" +
    "1. Zone de vent : la France est divisee en 4 zones (1 a 4). Plus la zone est elevee, plus les charges de vent sont importantes. Verifier la zone du chantier sur la carte Eurocode 1.\n\n" +
    "2. Charges critiques : les panneaux en bord de toiture et en angle sont les plus exposes. Renforcer les fixations dans ces zones (crochets supplementaires).\n\n" +
    "3. Espacement des crochets : en zone 3 et 4, reduire l espacement a 1,20 m maximum. En zone littoral, passer en visserie inox A4.\n\n" +
    "4. Garde au faitage : laisser minimum 20 cm entre le haut des panneaux et le faitage pour eviter le soulèvement.\n\n" +
    "5. Note de calcul : pour les installations importantes (>36 kWc) ou zones exposees, une note de calcul signee par un bureau d etudes est recommandee.",

  // ─── HUAWEI ────────────────────────────────────────────────────
  huawei_demarrage:
    "🔌 HUAWEI SUN2000 - NE DEMARRE PAS\n\n" +
    "✅ Checklist de diagnostic :\n\n" +
    "1. Verifier le sectionneur DC sous l onduleur : doit etre en position ON.\n\n" +
    "2. Verifier les sectionneurs DC dans le coffret de protection : tous en ON.\n\n" +
    "3. Verifier le disjoncteur AC et l interrupteur differentiel dans le tableau : en ON.\n\n" +
    "4. Tension DC : la tension string doit depasser le seuil minimum MPPT de l onduleur (generalement >200V). Mesurer avec un multimetre entre PV+ et PV-.\n\n" +
    "5. Si l onduleur affiche Arret Commande : ouvrir FusionSolar > Mise en service > Maintenance > Onduleur ON/OFF > envoyer commande Demarrage.\n\n" +
    "6. Code reseau non configure : verifier que le code reseau France est bien regle sur UTE C15-712-1 (A) dans les parametres.\n\n" +
    "7. Si premier demarrage : l onduleur a besoin de 5 minutes minimum pour verifier les protections avant de produire.\n\n" +
    "⚠️ Ne jamais ouvrir un sectionneur DC quand l onduleur est en production.",

  huawei_rendement:
    "📉 HUAWEI - SOUS-PRODUCTION\n\n" +
    "✅ Causes et solutions :\n\n" +
    "1. Ombrage partiel : verifier qu aucune cheminee, antenne ou arbre ne projette d ombre sur les panneaux en milieu de journee.\n\n" +
    "2. Encrassement : panneaux sales = perte de 10 a 25%. Nettoyer a l eau claire sans produit abrasif.\n\n" +
    "3. Probleme de string : dans FusionSolar, aller dans Gestion des alarmes et verifier si une alarme String est active. Mesurer le courant de chaque string avec une pince.\n\n" +
    "4. MPPT mal configure : verifier que les plages de tension MPPT correspondent bien aux strings installees.\n\n" +
    "5. Mise a jour firmware : dans FusionSolar, verifier que le firmware de l onduleur est a jour. Une ancienne version peut reduire les performances.\n\n" +
    "6. Smart Meter deconnecte : si l onduleur est en mode 0 injection et que le compteur ne communique plus, il peut throttler la production. Verifier la connexion RS485 du Smart Meter.",

  huawei_connexion:
    "📡 HUAWEI - CONNEXION SUN2000 / FUSIONSOLAR\n\n" +
    "✅ Etapes de connexion :\n\n" +
    "1. Connexion WiFi directe a l onduleur : aller dans les reglages WiFi du telephone, se connecter au reseau SUN2000-XXXXXX. Mot de passe par defaut : Changeme.\n\n" +
    "2. Dans l app SUN2000 : mot de passe de connexion par defaut = 00000a. Selectionner Reglage rapide pour configurer.\n\n" +
    "3. Pour connecter l onduleur au routeur domestique : FusionSolar > Mise en service > Parametres > Configuration communication > Connexion routeur.\n\n" +
    "4. Si la connexion FusionSolar cloud est perdue : verifier que le WiFi de la maison fonctionne. FusionSolar necessite une connexion internet stable. Sans WiFi, l app ne fonctionne pas en mode cloud.\n\n" +
    "5. Dongle 4G : si pas de WiFi sur site, utiliser un Smart Dongle 4G Huawei branche sur le port USB de l onduleur.\n\n" +
    "6. Reset connexion : si tout echoue, reinitialiser le mot de passe WiFi de l onduleur en appuyant sur le bouton reset 3 secondes.",

  huawei_erreurs:
    "⚠️ HUAWEI - CODES ERREUR ET LED\n\n" +
    "✅ Signification des LED :\n\n" +
    "LED rouge fixe = alarme majeure, onduleur arrete.\n" +
    "LED rouge clignotante = probleme parametres AC ou Smart Meter.\n" +
    "LED verte clignotante = demarrage ou fonctionnement normal.\n\n" +
    "✅ Codes erreur courants :\n\n" +
    "- Isolation basse (Low insulation) : probleme d isolement sur les cables DC ou un panneau. Debrancher les strings une par une pour isoler le defaut. Mesurer l isolement entre PV+ et terre, PV- et terre.\n\n" +
    "- Surtension reseau (Grid overvoltage) : tension du reseau EDF trop haute. L onduleur se protege. Contacter ENEDIS si recurrent.\n\n" +
    "- Frequence hors plage : verifier le reglage du code reseau.\n\n" +
    "- Smart Meter communication lost : verifier le branchement RS485 entre le compteur et l onduleur.\n\n" +
    "- Arc CC (AFCI) : detection d arc sur les cables DC. Inspecter tous les connecteurs MC4 et les cables pour un defaut d isolement.",

  huawei_batterie:
    "🔋 HUAWEI LUNA2000 - BATTERIE\n\n" +
    "✅ Points de verification :\n\n" +
    "1. Demarrage batterie : allumer d abord l onduleur SUN2000, puis l interrupteur d alimentation auxiliaire de la batterie, puis l interrupteur principal batterie.\n\n" +
    "2. Communication : la batterie LUNA2000 communique avec le SUN2000 par un cable de communication dedie. Verifier que ce cable est bien branche sur les ports COM des deux appareils.\n\n" +
    "3. SOC (etat de charge) : si la batterie ne charge pas, verifier dans FusionSolar le SOC et le mode de charge (Maximiser autoproduction, TOU, etc.).\n\n" +
    "4. Erreur batterie : si une alarme batterie apparait dans FusionSolar, noter le code exact. Les alarmes majeures necessitent souvent une intervention SAV Huawei.\n\n" +
    "5. Temperature : la LUNA2000 ne charge pas si la temperature est inferieure a 0°C ou superieure a 50°C. Normal en conditions extremes.\n\n" +
    "6. Mise a jour : les mises a jour firmware de la batterie se font automatiquement via FusionSolar quand l onduleur est connecte a internet.",

  // ─── ATMOCE ────────────────────────────────────────────────────
  atmoce_demarrage:
    "🔌 ATMOCE - ONDULEUR NE DEMARRE PAS\n\n" +
    "✅ Checklist de diagnostic :\n\n" +
    "1. Verifier la tension DC en entree de l onduleur : doit etre superieure au seuil de demarrage (generalement 150 a 200V selon modele).\n\n" +
    "2. Verifier le disjoncteur AC en aval de l onduleur : doit etre ferme.\n\n" +
    "3. Verifier le sectionneur DC : en position ON.\n\n" +
    "4. Attendre 5 a 10 minutes : les onduleurs ont un delai de demarrage automatique au lever du soleil quand la tension DC est suffisante.\n\n" +
    "5. Verifier le code reseau : doit etre configure pour la France (50 Hz, limites de tension conformes a UTE C15-712).\n\n" +
    "6. Verifier les connecteurs DC : un connecteur MC4 mal enfiche peut empecher le demarrage. Verifier chaque connexion.\n\n" +
    "7. Si le probleme persiste apres toutes ces verifications, noter le code d erreur affiche et contacter le support Atmoce.",

  atmoce_rendement:
    "📉 ATMOCE - SOUS-PRODUCTION\n\n" +
    "✅ Diagnostic :\n\n" +
    "1. Verifier l ombrage : meme une petite ombre sur un panneau peut impacter fortement toute une string.\n\n" +
    "2. Nettoyage des panneaux : verifier que les panneaux ne sont pas encrasses (fientes, poussiere, mousse).\n\n" +
    "3. Verifier les strings via le monitoring : comparer la production de chaque string. Une string en sous-production signale un probleme de panneau, de connecteur ou de cable.\n\n" +
    "4. Verifier les connexions MC4 : un connecteur oxyde ou mal enfiche cree une resistance supplementaire et reduit le courant.\n\n" +
    "5. Verifier les diodes bypass : si un panneau est en court-circuit interne, les diodes bypass le contournent mais la puissance de la string diminue.\n\n" +
    "6. Temperature onduleur : si l onduleur est trop chaud (mauvaise ventilation), il reduit sa puissance pour se proteger. Verifier que les grilles de ventilation sont degagees.",

  atmoce_connexion:
    "📡 ATMOCE - COMMUNICATION & MONITORING\n\n" +
    "✅ Etapes de resolution :\n\n" +
    "1. Verifier la connexion WiFi ou ethernet entre l onduleur et le routeur.\n\n" +
    "2. Verifier que le port de communication (RS485 ou WiFi selon modele) est bien configure dans les parametres de l onduleur.\n\n" +
    "3. Si utilisation d un datalogger : verifier que le datalogger est bien alimente et que le cable RS485 entre l onduleur et le datalogger est correct (A sur A, B sur B).\n\n" +
    "4. Verifier l adresse IP de l onduleur : en cas de conflit d adresse sur le reseau local, le monitoring peut echouer.\n\n" +
    "5. Redemarrer le datalogger ou le module de communication en coupant l alimentation 30 secondes.\n\n" +
    "6. Verifier que le port RS485 de l onduleur a la bonne configuration : 9600 bauds, 8 bits, 1 stop, pas de parite (parametres courants).",

  atmoce_erreurs:
    "⚠️ ATMOCE - CODES ERREUR\n\n" +
    "✅ Erreurs les plus courantes :\n\n" +
    "- Erreur isolement DC : resistance d isolement trop basse entre les cables DC et la terre. Inspecter les cables, connecteurs et panneaux. Debrancher les strings une par une pour trouver le defaut.\n\n" +
    "- Erreur reseau AC : tension ou frequence reseau hors tolerance. Mesurer la tension au niveau de l onduleur. Si le probleme est recurrent, contacter ENEDIS.\n\n" +
    "- Surtension DC : tension de string trop haute (souvent par grand froid). Verifier que la tension Voc x nombre de panneaux en froid ne depasse pas la tension max DC de l onduleur.\n\n" +
    "- Erreur temperature : onduleur en surchauffe. Verifier la ventilation et l absence d obstruction.\n\n" +
    "- Erreur communication : perte de contact avec le datalogger ou le monitoring. Voir section connexion.\n\n" +
    "⚠️ Toujours noter le code exact affiche sur l ecran de l onduleur avant d intervenir.",

  // ─── ENPHASE ───────────────────────────────────────────────────
  enphase_demarrage:
    "🔌 ENPHASE - MICRO-ONDULEUR NE REPOND PAS\n\n" +
    "✅ Diagnostic par LED :\n\n" +
    "- LED verte fixe puis 6 clignotements verts = demarrage normal.\n" +
    "- Clignotements rouges apres 2 minutes = pas de reseau AC detecte. Verifier le disjoncteur AC de la branche.\n" +
    "- LED rouge fixe = resistance DC faible detectable. Probleme d isolement sur le panneau ou le cable DC.\n" +
    "- Clignotements rouges courts au demarrage = defaillance interne au demarrage.\n\n" +
    "✅ Etapes de depannage :\n\n" +
    "1. Verifier le disjoncteur AC de la branche IQ Cable : doit etre ferme.\n\n" +
    "2. Verifier la tension AC au niveau du connecteur IQ Cable (doit etre 230V).\n\n" +
    "3. Deconnecter et reconnecter le connecteur DC du panneau sur le micro-onduleur. La LED doit s allumer en vert 6 secondes apres.\n\n" +
    "4. Verifier le IQ Cable et ses connexions : pas de dommages, pas de connecteur mal enfiche.\n\n" +
    "5. Si le micro-onduleur est tout neuf et clignote rouge : il doit etre configure via la passerelle IQ Gateway (Envoy). Sans passerelle, il ne produira pas.\n\n" +
    "6. Reset : couper le disjoncteur AC 10 minutes, puis le rermer. Attendre 5 minutes pour que le micro-onduleur redemarre.",

  enphase_rendement:
    "📉 ENPHASE - MODULE EN SOUS-PRODUCTION\n\n" +
    "✅ Diagnostic via Enlighten :\n\n" +
    "1. Dans Enlighten ou l app Enphase Installer : aller dans la vue par micro-onduleur. Un module en rouge ou orange = probleme identifie.\n\n" +
    "2. Comparer la production du module suspect avec ses voisins de meme orientation. Un ecart de plus de 20% est anormal.\n\n" +
    "3. Ombrage localise : verifier qu une fiente, une feuille ou un objet ne couvre pas partiellement le panneau.\n\n" +
    "4. Micro-onduleur defaillant : si tous les panneaux autour produisent normalement et que le panneau suspect a un bon ensoleillement, le micro-onduleur est probablement defaillant. Contacter Enphase pour RMA (garantie 25 ans sur IQ series).\n\n" +
    "5. Connecteur DC desserre : deconnecter/reconnecter les connecteurs DC entre panneau et micro-onduleur (couper AC avant).\n\n" +
    "6. Probleme de panneau : mesurer le Voc et le Isc du panneau directement. Si valeurs anormales, c est le panneau qui est defaillant.",

  enphase_connexion:
    "📡 ENPHASE - ENVOY & ENLIGHTEN APP\n\n" +
    "✅ Resolution des problemes de connexion :\n\n" +
    "1. LED nuage rouge sur l Envoy = pas de connexion internet. Reconnecter le WiFi : appuyer 1 seconde sur le bouton telephone de l Envoy, la LED 2 s allume en vert. Aller dans WiFi telephone > se connecter au reseau Envoy_XXXXXX > dans l app configurer le nouveau reseau WiFi domestique.\n\n" +
    "2. LED fleches rouge = l Envoy ne communique plus avec un ou plusieurs micro-onduleurs. Communication par CPL (courant porteur). Verifier que l Envoy est branche pres du tableau electrique. Des perturbations sur le reseau electrique peuvent bloquer le CPL.\n\n" +
    "3. Toutes les LED clignotent rouge = l Envoy demarre. Normal si ca dure moins de 60 minutes. Sinon, couper et rallumer le disjoncteur de l Envoy 30 secondes.\n\n" +
    "4. Envoy fige : couper le disjoncteur de l Envoy 30 secondes puis le rallumer.\n\n" +
    "5. Mise a jour Envoy : les mises a jour se font automatiquement. Ne pas couper l alimentation pendant une mise a jour (LED clignote de facon inhabituelle).\n\n" +
    "6. Relais IQ Relay defectueux : si le relais IQ Relay est installe et defaillant, il peut bloquer toute communication entre micro-onduleurs et Envoy.",

  enphase_erreurs:
    "⚠️ ENPHASE - CODES LED ET ERREURS\n\n" +
    "✅ Signification des LED micro-onduleur :\n\n" +
    "- Vert fixe (2 min) puis 6 clignotements verts = demarrage normal OK.\n" +
    "- Clignotements rouges = pas de reseau AC ou configuration manquante.\n" +
    "- Rouge fixe = resistance DC basse, isolement defaillant (< 7 kohms entre PV+/PV- et terre).\n" +
    "- Orange clignotant = micro-onduleur configure mais passerelle Envoy absente ou non detectee.\n\n" +
    "✅ Signification des LED passerelle Envoy :\n\n" +
    "- LED nuage rouge = pas d internet.\n" +
    "- LED fleches rouge = pas de communication avec un ou plusieurs micro-onduleurs.\n" +
    "- LED eclair rouge = disjoncteur de branche AC saute ou probleme de production.\n" +
    "- Toutes LED rouge clignotantes = demarrage en cours (normal < 60 min).\n\n" +
    "✅ Erreur resistance DC basse :\n" +
    "Mesurer la resistance entre PV+ et terre puis PV- et terre. Valeur normale = plusieurs megaohms. Si < 7 kohms, remplacer le panneau ou le micro-onduleur selon ou se situe le defaut.",

  enphase_batterie:
    "🔋 ENPHASE IQ BATTERY - STOCKAGE\n\n" +
    "✅ Points de verification :\n\n" +
    "1. Communication : la batterie IQ Battery communique avec l Envoy via le reseau electrique (CPL). L Envoy doit etre branche pres du tableau pour une bonne communication.\n\n" +
    "2. Modes de charge : configurer dans Enlighten ou l app Installer : mode Autoproduction (charge quand surplus solaire) ou mode Secours (reserve pour coupure reseau).\n\n" +
    "3. Batterie ne charge pas : verifier que l onduleur produit bien. Verifier que le mode de charge n est pas regle sur Aucune charge. Verifier l etat SOC dans l app.\n\n" +
    "4. Batterie ne se decharge pas : verifier le mode de decharge dans l app. En mode Faible cout, la batterie ne se decharge que selon les plages tarifaires configurees.\n\n" +
    "5. Erreur batterie dans Enlighten : noter le code d evenement affiche. Les erreurs majeures necessitent un contact avec le support Enphase (garantie 10 ans IQ Battery).\n\n" +
    "6. Temperature : la batterie IQ ne fonctionne pas en dessous de -10°C. Installation en espace chauffe recommandee."
};

bot.onText(/\/start/, function(msg) {
  var chatId = msg.chat.id;
  var prenom = msg.from.first_name || "technicien";
  bot.sendMessage(
    chatId,
    "☀️ Bienvenue sur SolarBot, " + prenom + " !\n\nJe suis ton assistant pour les chantiers photovoltaiques.\n\n🔧 Toiture, Huawei, Atmoce, Enphase\n\n👇 Choisis une categorie :",
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

console.log("☀️ SolarBot demarre - mode reponses integrees !");
