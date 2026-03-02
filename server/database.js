import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'newsletter.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    category TEXT DEFAULT 'tendances',
    likes_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    news_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
  );
`);

// Add category column if it doesn't exist (migration for existing DBs)
try {
  db.exec(`ALTER TABLE news ADD COLUMN category TEXT DEFAULT 'tendances'`);
} catch {
  // Column already exists
}

// Seed mock news articles if table is empty
const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get();
if (newsCount.count === 0) {
  const insertNews = db.prepare(
    'INSERT INTO news (title, excerpt, content, image, category) VALUES (?, ?, ?, ?, ?)'
  );

  // Article 1 — L'Art du Minimalisme Digital
  insertNews.run(
    "L'Art du Minimalisme Digital",
    "Comment simplifier votre vie numérique en 5 étapes concrètes et retrouver un rapport sain à la technologie.",
    "Le minimalisme digital est devenu un mouvement incontournable. Dans cet article, nous explorons comment réduire le bruit numérique, organiser vos outils et retrouver la clarté mentale nécessaire pour créer.\n\nLe premier pas vers le minimalisme digital consiste à faire un audit complet de vos outils numériques. Combien d'applications utilisez-vous réellement au quotidien ? Probablement bien moins que celles installées sur vos appareils. En moyenne, un utilisateur possède 80 applications sur son smartphone mais n'en utilise que 9 par jour. Ce décalage crée un bruit de fond permanent : notifications inutiles, mises à jour constantes, et une charge cognitive invisible.\n\n## Pourquoi le minimalisme digital est essentiel\n\nLa surcharge numérique n'est pas qu'un inconfort — c'est un véritable frein à la productivité et à la créativité. Des études récentes de l'Université de Californie montrent que chaque interruption numérique nécessite en moyenne 23 minutes pour retrouver sa concentration initiale. Sur une journée de travail, cela peut représenter jusqu'à 2h30 de temps perdu.\n\nLe minimalisme digital ne signifie pas rejeter la technologie. C'est au contraire une approche intentionnelle : choisir consciemment les outils qui apportent une vraie valeur à votre vie, et éliminer le reste. Cal Newport, auteur de \"Digital Minimalism\", le résume parfaitement : \"La clé n'est pas d'utiliser moins de technologie, mais d'utiliser la bonne technologie, de la bonne manière.\"\n\n## Les 5 étapes clés\n\n**1. L'inventaire numérique** — Listez toutes vos applications, abonnements et services en ligne. Classez-les en trois catégories : essentiel, utile, superflu. Soyez honnête avec vous-même. Ce réseau social que vous scrollez par habitude, apporte-t-il réellement quelque chose à votre quotidien ? Ce service de streaming que vous payez mais ne regardez jamais, mérite-t-il sa place ? L'objectif n'est pas de tout supprimer, mais de prendre conscience de la place que chaque outil occupe dans votre vie.\n\n**2. La purge des notifications** — Désactivez 90% de vos notifications. Seules les communications directes méritent de vous interrompre. Les notifications sont conçues pour capter votre attention, pas pour vous servir. Chaque vibration, chaque badge rouge déclenche une micro-dose de dopamine qui vous conditionne à vérifier compulsivement votre écran. En désactivant les notifications non essentielles, vous reprenez le contrôle de votre attention.\n\n**3. Le mono-outil** — Pour chaque besoin, choisissez UN seul outil. Prise de notes ? Un seul outil. Gestion de projet ? Un seul outil. Communication d'équipe ? Un seul outil. La multiplication des outils crée de la fragmentation : vos notes sont dispersées entre 4 applications, vos conversations éparpillées sur 5 plateformes. En centralisant, vous gagnez en efficacité et en sérénité.\n\n**4. Les plages digitales** — Définissez des heures sans écran. Le matin avant 9h et le soir après 20h sont des bons points de départ. Ces moments de déconnexion permettent à votre cerveau de se reposer et de fonctionner en \"mode diffus\", un état propice à la créativité et à la résolution de problèmes.\n\n**5. La diète informationnelle** — Remplacez le scroll infini par des newsletters curées (comme celle-ci !). Qualité plutôt que quantité. Le cerveau humain n'est pas fait pour absorber un flux continu d'informations. En choisissant 3 à 5 sources d'information de qualité, vous restez informé sans être submergé.\n\n## Les bénéfices concrets\n\nAprès 30 jours de minimalisme digital, les pratiquants rapportent en moyenne : une réduction de 40% du temps d'écran, une amélioration significative de la qualité du sommeil, et surtout, un sentiment de liberté retrouvée. Le temps libéré peut être réinvesti dans ce qui compte vraiment : la création, les relations humaines, la lecture, ou tout simplement le plaisir de ne rien faire.\n\nLe minimalisme digital n'est pas une destination, c'est un processus continu d'optimisation. Commencez petit, expérimentez, et trouvez l'équilibre qui vous convient. Votre futur vous en remerciera.",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1400&h=900&fit=crop&q=80",
    "digital"
  );

  // Article 2 — Tendances Créatives 2026
  insertNews.run(
    "Tendances Créatives 2026",
    "Les 10 tendances design et créatives qui vont redéfinir notre paysage visuel cette année.",
    "De la typographie cinétique aux palettes néo-brutalistes, les tendances créatives de 2026 nous emmènent vers un design plus audacieux, plus humain et résolument expérimental.\n\nL'année 2026 marque un tournant dans l'histoire du design numérique. Après des années de convergence vers des interfaces homogènes — les mêmes coins arrondis, les mêmes palettes neutres, les mêmes layouts —, une nouvelle génération de designers bouscule les codes. Leur credo ? L'expérimentation au service de l'émotion.\n\n## Les tendances majeures\n\n**1. Typographie cinétique** — Les lettres bougent, dansent, se transforment. La typo n'est plus un support passif mais un élément narratif à part entière. Grâce aux technologies web modernes et aux variable fonts, les designers peuvent désormais animer chaque glyphe, créer des interactions typographiques qui racontent une histoire. Des studios comme Locomotive et Active Theory poussent cette tendance à son paroxysme.\n\n**2. Néo-brutalisme mature** — Après les excès du brutalisme web, une version plus raffinée émerge : bordures franches mais palettes soignées, grilles cassées mais lisibilité préservée. Le néo-brutalisme mature conserve l'énergie brute et la personnalité du brutalisme originel tout en intégrant les leçons d'accessibilité et d'ergonomie.\n\n**3. Design émotionnel** — Les interfaces cherchent à provoquer des émotions spécifiques. Chaque micro-interaction est pensée pour créer un sentiment de satisfaction. Un bouton qui rebondit légèrement au clic, un formulaire qui célèbre l'envoi avec une animation élégante, un loading screen qui divertit plutôt qu'il ne frustre.\n\n**4. 3D immersive accessible** — Les outils 3D deviennent accessibles à tous les designers. Spline, Rive, Framer — la 3D n'est plus réservée aux spécialistes. En 2026, intégrer un élément 3D interactif dans un site web est devenu aussi simple que d'ajouter une image.\n\n**5. Palettes terre et minéral** — Retour aux couleurs naturelles : terracotta, vert sauge, ocre, bleu ardoise. Un ancrage dans le réel face au tout-numérique. Ces palettes évoquent la chaleur, l'authenticité et le calme — des qualités que les utilisateurs recherchent de plus en plus.\n\n**6. Design génératif** — L'IA co-crée avec le designer. Pas pour remplacer, mais pour explorer des territoires impossibles à atteindre seul. Les outils de design génératif permettent de créer des milliers de variations d'un concept en quelques minutes.\n\n**7. Glassmorphism 2.0** — Transparences et flous gaussiens reviennent, mais avec plus de subtilité et de contraste. La nouvelle itération intègre des effets de profondeur plus réalistes et des reflets dynamiques.\n\n**8. Scroll-telling** — Les sites racontent des histoires au scroll. Chaque section est une scène, chaque transition un moment de narration. Les marques de luxe et les médias adoptent massivement cette approche.\n\n**9. Variable fonts partout** — Une seule police, mille expressions. Les polices variables permettent des animations fluides et des designs adaptatifs. Elles optimisent les performances tout en offrant une flexibilité typographique sans précédent.\n\n**10. Dark mode premium** — Le dark mode n'est plus un simple inversement de couleurs, mais un mode premium soigné avec des contrastes subtils. Les meilleurs dark modes utilisent des noirs légèrement teintés, des accents lumineux dosés, et des ombres portées sophistiquées.\n\n## Ce que ces tendances nous disent\n\nAu-delà des techniques, ces tendances révèlent un mouvement profond : le design sort de l'ère de l'optimisation froide pour entrer dans celle de l'expression et de l'émotion. Les utilisateurs ne veulent plus seulement des interfaces efficaces — ils veulent des interfaces qui les font ressentir quelque chose.",
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1400&h=900&fit=crop&q=80",
    "tendances"
  );

  // Article 3 — La Renaissance des Newsletters
  insertNews.run(
    "La Renaissance des Newsletters",
    "Pourquoi le format newsletter connaît un essor sans précédent à l'ère des réseaux sociaux.",
    "Face à la saturation des flux algorithmiques, les newsletters offrent un espace de lecture curé, intime et sans distraction. Analyse d'un phénomène culturel en pleine expansion.\n\nIl y a quelques années, prédire la mort de l'email était un sport national dans la Silicon Valley. Ironie de l'histoire : non seulement l'email survit, mais il connaît une véritable renaissance grâce aux newsletters.\n\n## Un refuge face au bruit\n\nLes réseaux sociaux sont devenus des machines à générer du bruit. L'algorithme décide de ce que vous voyez, quand vous le voyez, et comment vous le voyez. La newsletter, elle, arrive dans votre boîte mail — un espace qui vous appartient. Pas d'algorithme, pas de publicité intrusive, pas de notifications parasites. Juste un contenu que vous avez choisi de recevoir.\n\nCette relation directe entre l'auteur et le lecteur est au cœur du succès des newsletters. Contrairement aux posts sur les réseaux sociaux conçus pour maximiser l'engagement, les newsletters sont conçues pour apporter de la valeur. L'auteur sait que chaque ouverture est un acte volontaire du lecteur — et cette confiance mutuelle change tout.\n\n## L'économie des créateurs\n\nSubstack, Beehiiv, Ghost, ConvertKit — les outils se multiplient et démocratisent la création de newsletters. Un créateur peut désormais vivre de sa plume avec quelques milliers d'abonnés fidèles. Le modèle économique est simple : soit un abonnement payant (entre 5€ et 15€/mois), soit un modèle gratuit financé par des sponsors sélectionnés.\n\nCe qui rend ce modèle attractif, c'est sa prévisibilité. Un créateur avec 2 000 abonnés payants à 8€/mois génère 16 000€ mensuels — largement de quoi en faire une activité à temps plein.\n\n## Les chiffres parlent\n\n- Le marché des newsletters a crû de **300%** entre 2020 et 2025\n- Le taux d'ouverture moyen d'une newsletter de qualité dépasse **55%**\n- **72%** des lecteurs préfèrent recevoir du contenu par email plutôt que par les réseaux sociaux\n- Les newsletters premium ont un taux de rétention de **85%** après 12 mois\n\n## Pourquoi ça marche ?\n\n**L'intimité** — Une newsletter, c'est une conversation directe entre l'auteur et le lecteur. Pas de commentaires toxiques, pas de trolls, pas de likes à chasser. C'est un espace protégé où l'auteur peut être authentique et nuancé.\n\n**La régularité** — Le rendez-vous hebdomadaire crée une habitude de lecture. Comme un magazine qui arrive tous les vendredis. Cette régularité forge un lien fort entre l'auteur et ses lecteurs.\n\n**La curation** — Dans un monde de surabondance informationnelle, le filtre éditorial est un luxe. Les meilleures newsletters disent \"non\" à 90% du contenu pour ne garder que l'essentiel.\n\n## L'avenir de la newsletter\n\nLa newsletter n'est pas une mode passagère. C'est un retour aux fondamentaux de la communication : un message, un auteur, un lecteur. Les prochaines évolutions incluent l'intégration de contenus multimédias, la personnalisation via l'IA, et l'émergence de communautés autour des newsletters les plus populaires.",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1400&h=900&fit=crop&q=80",
    "culture"
  );

  // Article 4 — L'IA au Service de la Créativité
  insertNews.run(
    "L'IA au Service de la Créativité",
    "Comment les outils d'intelligence artificielle transforment le processus créatif sans le remplacer.",
    "L'intelligence artificielle n'est pas venue remplacer les créatifs — elle est venue leur donner des super-pouvoirs. Découvrez comment les meilleurs studios intègrent l'IA dans leur workflow.\n\nL'arrivée de l'IA générative dans le monde créatif a provoqué un séisme. D'un côté, les techno-optimistes qui annoncent la fin des designers. De l'autre, les résistants qui refusent en bloc toute interaction avec ces outils. La réalité, comme souvent, se situe entre les deux.\n\n## Un assistant, pas un remplaçant\n\nL'erreur serait de voir l'IA comme un outil de remplacement. Les studios les plus innovants l'utilisent comme un catalyseur de créativité : brainstorming augmenté, exploration de variations, prototypage rapide. L'IA excelle dans les phases d'idéation où la quantité prime sur la qualité. Elle peut générer 100 concepts en quelques minutes là où un humain en produirait 10 en une journée.\n\nMais — et c'est un mais crucial — l'IA ne sait pas éditer. Elle ne sait pas choisir. Elle ne sait pas comprendre le contexte émotionnel d'un brief, l'historique d'une marque, ou les nuances culturelles d'un marché. Ces compétences restent l'apanage des créatifs humains. Le meilleur workflow est hybride : l'IA pour explorer, l'humain pour décider.\n\n## Les outils qui changent la donne\n\n- **Midjourney et DALL-E 3** pour l'exploration visuelle rapide — idéal pour les moodboards et la direction artistique\n- **Claude et GPT-4** pour la rédaction, l'analyse et la structuration d'idées — parfaits pour le brainstorming\n- **Runway et Pika** pour la vidéo générative — rendre la création vidéo accessible aux petits studios\n- **Suno et Udio** pour la création musicale — composer une bande sonore en quelques minutes\n\n## Le workflow hybride idéal\n\nLe futur appartient aux créatifs qui savent dialoguer avec l'IA. Voici le workflow recommandé, basé sur les pratiques des studios les plus avancés :\n\n**Phase 1 : Exploration** — Utilisez l'IA pour générer un maximum d'idées et de directions. Ne cherchez pas la perfection, cherchez l'inspiration. Donnez des prompts variés, explorez des styles que vous n'auriez jamais envisagés. C'est dans cette phase que l'IA brille le plus.\n\n**Phase 2 : Sélection** — C'est ici que l'expertise humaine intervient. Analysez les résultats, identifiez les pépites, combinez les meilleures idées. L'œil du créatif, nourri par des années d'expérience et de culture visuelle, fait toute la différence.\n\n**Phase 3 : Raffinement** — Prenez les directions sélectionnées et affinez-les manuellement. Ajustez les détails, adaptez au contexte de la marque, assurez la cohérence. C'est le travail de craft que seul un humain peut réaliser avec la précision nécessaire.\n\n**Phase 4 : Production** — Finalisez les livrables avec vos outils traditionnels. L'IA peut encore intervenir pour des tâches répétitives (redimensionnement, déclinaisons).\n\n## Les questions éthiques\n\nL'utilisation de l'IA dans la création soulève des questions légitimes. La question des droits d'auteur des données d'entraînement reste ouverte. La transparence envers les clients est essentielle — indiquer quand et comment l'IA a été utilisée n'est pas une faiblesse, c'est une preuve de professionnalisme.\n\nL'IA créative n'en est qu'à ses débuts. Ceux qui apprennent à l'intégrer intelligemment dans leur pratique aujourd'hui auront un avantage considérable dans les années à venir.",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=900&fit=crop&q=80",
    "digital"
  );

  // Article 5 — Le Retour du Print
  insertNews.run(
    "Le Retour du Print",
    "Pourquoi les magazines papier et les livres physiques connaissent un regain d'intérêt inattendu.",
    "Dans un monde saturé d'écrans, le papier redevient un objet de désir. Magazines indépendants, livres d'artistes, zines — le print n'a jamais été aussi vivant.\n\nC'est paradoxal, et c'est précisément ce qui rend le phénomène fascinant. Alors que nous passons en moyenne 7 heures par jour devant des écrans, les ventes de livres physiques ont atteint un record historique en 2025. Les magazines indépendants prolifèrent, les fanzines connaissent un revival spectaculaire, et les imprimeries artisanales ne désemplissent pas.\n\n## Le luxe de la déconnexion\n\nTenir un magazine dans ses mains, tourner les pages, sentir l'encre — c'est une expérience sensorielle complète que le numérique ne peut pas reproduire. Le papier engage les sens d'une manière qu'aucun écran ne peut égaler. Le poids du livre dans les mains, le grain du papier sous les doigts, l'odeur caractéristique de l'encre fraîche — ces sensations créent un ancrage cognitif qui favorise la mémorisation et la concentration.\n\nDes études neuroscientifiques confirment ce que les amoureux du papier savent intuitivement : la lecture sur papier active des zones du cerveau différentes de la lecture sur écran. La compréhension est meilleure, la rétention plus durable, et le plaisir de la lecture plus intense.\n\n## Les nouveaux acteurs du print\n\nDes dizaines de magazines indépendants naissent chaque année. Leur point commun ? Une exigence éditoriale et visuelle sans compromis, des tirages limités, et un lien fort avec leur communauté de lecteurs. Ces publications ne cherchent pas à concurrencer le numérique — elles offrent autre chose : de la profondeur, de la beauté, du temps long.\n\n**Offscreen Magazine** explore la relation entre technologie et humanité à travers des portraits intimistes. **Weapons of Reason** décortique les grands enjeux contemporains avec un design éditorial époustouflant. **Drift** raconte les cultures du café à travers le monde. Chaque numéro est un objet qu'on garde, qu'on expose, qu'on offre.\n\n## Le mouvement des zines\n\nLe zine — publication autoproduite, souvent photocopiée, distribuée en direct — connaît une renaissance spectaculaire. Les festivals de zines se multiplient dans toutes les grandes villes. Ce format ultra-démocratique permet à quiconque de devenir éditeur avec un budget proche de zéro.\n\nCe qui distingue le nouveau mouvement zine, c'est son hybridité. Beaucoup de créateurs utilisent les réseaux sociaux pour promouvoir leurs zines, mêlant habilement le numérique et le physique. Instagram devient la vitrine, le zine devient l'objet.\n\n## L'impact environnemental\n\nLa question écologique du print évolue aussi. L'industrie papetière européenne est aujourd'hui l'une des plus durables : 72% des fibres utilisées sont recyclées, les forêts d'exploitation sont gérées durablement, et l'empreinte carbone d'un livre papier est inférieure à celle de plusieurs années de stockage cloud.\n\n## Pourquoi le print a de l'avenir\n\nLe print ne reviendra pas à ses niveaux des années 2000 — et il n'a pas besoin de le faire. Sa force réside dans sa rareté et sa qualité. Un monde où tout est numérique rend le physique précieux. Un magazine bien imprimé n'est plus un simple véhicule d'information, c'est un objet culturel, un acte de résistance douce contre l'éphémère digital.",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=900&fit=crop&q=80",
    "culture"
  );

  // Article 6 — Design System : Guide Complet
  insertNews.run(
    "Design System : Guide Complet",
    "Tout ce qu'il faut savoir pour construire un design system robuste et évolutif en 2026.",
    "Un design system n'est pas juste une bibliothèque de composants. C'est un langage partagé entre designers et développeurs, un contrat visuel qui garantit la cohérence d'un produit.\n\nImaginez une entreprise où chaque designer crée ses boutons différemment, où chaque développeur invente ses propres couleurs, et où chaque équipe utilise des typographies distinctes. Le résultat ? Un produit incohérent, une dette technique massive, et des utilisateurs désorientés.\n\n## Qu'est-ce qu'un design system exactement ?\n\nUn design system est bien plus qu'un kit UI ou une bibliothèque de composants. C'est un écosystème complet qui comprend des principes de design, des guidelines, des tokens, des composants réutilisables, des patterns d'interaction et une documentation vivante. C'est la source de vérité unique qui aligne toutes les équipes.\n\nLes design systems les plus réussis — Material Design de Google, Carbon d'IBM, Polaris de Shopify — ne se contentent pas de fournir des composants. Ils articulent une philosophie de design, des principes d'accessibilité, et des guidelines d'écriture UX.\n\n## Les piliers d'un design system\n\n**1. Les tokens** — Couleurs, typographies, espacements, ombres. Les tokens sont les atomes de votre système. Ils définissent les valeurs fondamentales utilisées partout dans votre produit. Un token n'est pas juste une valeur CSS — c'est une décision de design documentée et justifiée. Par exemple, votre couleur primaire n'est pas simplement \"#FF5E00\" — c'est \"la couleur qui exprime l'énergie et l'action dans notre marque\".\n\n**2. Les composants** — Boutons, inputs, cartes, modales. Chaque composant est documenté, versionné et testé. Un bon composant est comme un Lego : autonome, prévisible, et combinable à l'infini. Il doit couvrir tous les états possibles (hover, focus, disabled, loading, error), toutes les tailles nécessaires, et être accessible par défaut.\n\n**3. Les patterns** — Les patterns décrivent comment les composants s'assemblent pour former des interfaces complètes. Un pattern de formulaire, par exemple, définit l'ordre des champs, le positionnement des labels, le comportement de validation, et les messages d'erreur.\n\n**4. La documentation** — Un design system sans documentation est un design system mort. Storybook, Figma, Notion — peu importe l'outil, la doc doit vivre. Chaque composant, chaque pattern, chaque token doit être documenté avec des exemples d'utilisation et des guidelines.\n\n## Comment démarrer\n\nConstruire un design system de zéro peut sembler intimidant. La clé ? Commencer petit et itérer. N'essayez pas de tout couvrir dès le départ.\n\n**Étape 1 : L'audit visuel** — Capturez chaque variation de chaque élément UI dans votre produit. Vous découvrirez probablement 15 nuances de bleu, 8 tailles de bouton et 12 styles d'input. Cet inventaire est la base de votre rationalisation.\n\n**Étape 2 : Les tokens fondamentaux** — Définissez votre palette de couleurs, votre échelle typographique et votre système d'espacement. Ces décisions sont les fondations sur lesquelles tout le reste sera construit.\n\n**Étape 3 : Les composants critiques** — Commencez par les boutons, les inputs, et les cartes. Ce sont les composants les plus utilisés et ceux qui auront le plus d'impact immédiat.\n\n**Étape 4 : La gouvernance** — Qui maintient le design system ? Comment soumettre un nouveau composant ? Comment signaler un bug ? Sans gouvernance claire, le design system deviendra une dette de plus.\n\n## Le ROI d'un design system\n\nLes chiffres sont éloquents : Salesforce estime que leur design system Lightning a réduit le temps de développement de 25%. Spotify rapporte une réduction de 50% des incohérences visuelles. Et au-delà des métriques, il y a un bénéfice humain : les designers et développeurs qui travaillent avec un design system mature sont plus satisfaits et plus productifs. C'est un investissement qui se paye en semaines et qui rapporte pendant des années.",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&h=900&fit=crop&q=80",
    "tendances"
  );
}

// Seed a sample community thread if empty
const threadCount = db.prepare('SELECT COUNT(*) as count FROM threads').get();
if (threadCount.count === 0) {
  const insertThread = db.prepare(
    'INSERT INTO threads (title, author, content) VALUES (?, ?, ?)'
  );
  insertThread.run(
    'Quel est votre outil créatif préféré en 2026 ?',
    'Marie L.',
    'Je suis curieuse de savoir quels outils vous utilisez au quotidien pour vos projets créatifs. Personnellement, je suis passée à Figma + Framer et je ne reviendrais en arrière pour rien au monde !'
  );
  insertThread.run(
    'Recommandations de lectures pour le weekend',
    'Thomas B.',
    'Partageons nos meilleures lectures de la semaine ! Je viens de terminer "Thinking in Systems" de Donella Meadows — absolument brillant.'
  );

  // Add a sample reply
  const insertReply = db.prepare(
    'INSERT INTO replies (thread_id, author, content) VALUES (?, ?, ?)'
  );
  insertReply.run(1, 'Lucas D.', 'Figma est incroyable ! J\'utilise aussi Notion pour organiser tout mon workflow créatif.');
  insertReply.run(2, 'Sophie R.', 'Excellent choix ! Je recommande aussi "Atomic Habits" de James Clear pour la productivité.');
}

// --- Helpers ---

// Subscribers
export const addSubscriber = (email) => {
  const stmt = db.prepare('INSERT INTO subscribers (email) VALUES (?)');
  return stmt.run(email);
};

export const getAllSubscribers = () => {
  return db.prepare('SELECT * FROM subscribers ORDER BY subscribed_at DESC').all();
};

// News
export const getAllNews = (filters = {}) => {
  let query = 'SELECT * FROM news';
  const conditions = [];
  const params = [];

  if (filters.category) {
    conditions.push('category = ?');
    params.push(filters.category);
  }

  if (filters.search) {
    conditions.push('(title LIKE ? OR excerpt LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  if (filters.sort === 'oldest') {
    query += ' ORDER BY created_at ASC';
  } else {
    query += ' ORDER BY created_at DESC';
  }

  return db.prepare(query).all(...params);
};

export const getNewsById = (id) => {
  return db.prepare('SELECT * FROM news WHERE id = ?').get(id);
};

export const likeNews = (id) => {
  db.prepare('UPDATE news SET likes_count = likes_count + 1 WHERE id = ?').run(id);
  return db.prepare('SELECT likes_count FROM news WHERE id = ?').get(id);
};

export const getCategories = () => {
  return db.prepare('SELECT DISTINCT category FROM news ORDER BY category').all().map(r => r.category);
};

// Comments
export const getCommentsByNewsId = (newsId) => {
  return db.prepare('SELECT * FROM comments WHERE news_id = ? ORDER BY created_at ASC').all(newsId);
};

export const addComment = (newsId, author, content) => {
  const stmt = db.prepare('INSERT INTO comments (news_id, author, content) VALUES (?, ?, ?)');
  return stmt.run(newsId, author, content);
};

// Threads
export const getAllThreads = () => {
  const threads = db.prepare('SELECT * FROM threads ORDER BY created_at DESC').all();
  // Add reply count to each thread
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM replies WHERE thread_id = ?');
  return threads.map(t => ({
    ...t,
    reply_count: countStmt.get(t.id).count
  }));
};

export const addThread = (title, author, content) => {
  const stmt = db.prepare('INSERT INTO threads (title, author, content) VALUES (?, ?, ?)');
  return stmt.run(title, author, content);
};

// Replies
export const getRepliesByThreadId = (threadId) => {
  return db.prepare('SELECT * FROM replies WHERE thread_id = ? ORDER BY created_at ASC').all(threadId);
};

export const addReply = (threadId, author, content) => {
  const stmt = db.prepare('INSERT INTO replies (thread_id, author, content) VALUES (?, ?, ?)');
  return stmt.run(threadId, author, content);
};

export default db;
