/**
 * Script de seed — Insère les données initiales dans Supabase
 * Usage : node server/seed.js
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
    console.log('🌱 Seeding Supabase...');

    // --- News Articles ---
    const articles = [
        {
            title: "L'Art du Minimalisme Digital",
            excerpt: "Comment simplifier votre vie numérique en 5 étapes concrètes et retrouver un rapport sain à la technologie.",
            content: "Le minimalisme digital est devenu un mouvement incontournable. Dans cet article, nous explorons comment réduire le bruit numérique, organiser vos outils et retrouver la clarté mentale nécessaire pour créer.\n\nLe premier pas vers le minimalisme digital consiste à faire un audit complet de vos outils numériques. Combien d'applications utilisez-vous réellement au quotidien ? Probablement bien moins que celles installées sur vos appareils. En moyenne, un utilisateur possède 80 applications sur son smartphone mais n'en utilise que 9 par jour. Ce décalage crée un bruit de fond permanent : notifications inutiles, mises à jour constantes, et une charge cognitive invisible.\n\n## Pourquoi le minimalisme digital est essentiel\n\nLa surcharge numérique n'est pas qu'un inconfort — c'est un véritable frein à la productivité et à la créativité. Des études récentes de l'Université de Californie montrent que chaque interruption numérique nécessite en moyenne 23 minutes pour retrouver sa concentration initiale. Sur une journée de travail, cela peut représenter jusqu'à 2h30 de temps perdu.\n\nLe minimalisme digital ne signifie pas rejeter la technologie. C'est au contraire une approche intentionnelle : choisir consciemment les outils qui apportent une vraie valeur à votre vie, et éliminer le reste.\n\n## Les 5 étapes clés\n\n**1. L'inventaire numérique** — Listez toutes vos applications, abonnements et services en ligne. Classez-les en trois catégories : essentiel, utile, superflu.\n\n**2. La purge des notifications** — Désactivez 90% de vos notifications. Seules les communications directes méritent de vous interrompre.\n\n**3. Le mono-outil** — Pour chaque besoin, choisissez UN seul outil.\n\n**4. Les plages digitales** — Définissez des heures sans écran. Le matin avant 9h et le soir après 20h sont des bons points de départ.\n\n**5. La diète informationnelle** — Remplacez le scroll infini par des newsletters curées (comme celle-ci !).",
            image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1400&h=900&fit=crop&q=80",
            category: "digital"
        },
        {
            title: "Tendances Créatives 2026",
            excerpt: "Les 10 tendances design et créatives qui vont redéfinir notre paysage visuel cette année.",
            content: "De la typographie cinétique aux palettes néo-brutalistes, les tendances créatives de 2026 nous emmènent vers un design plus audacieux, plus humain et résolument expérimental.\n\n## Les tendances majeures\n\n**1. Typographie cinétique** — Les lettres bougent, dansent, se transforment. La typo n'est plus un support passif mais un élément narratif à part entière.\n\n**2. Néo-brutalisme mature** — Après les excès du brutalisme web, une version plus raffinée émerge : bordures franches mais palettes soignées.\n\n**3. Design émotionnel** — Les interfaces cherchent à provoquer des émotions spécifiques.\n\n**4. 3D immersive accessible** — Les outils 3D deviennent accessibles à tous les designers.\n\n**5. Palettes terre et minéral** — Retour aux couleurs naturelles : terracotta, vert sauge, ocre, bleu ardoise.\n\n**6. Design génératif** — L'IA co-crée avec le designer.\n\n**7. Glassmorphism 2.0** — Transparences et flous gaussiens reviennent.\n\n**8. Scroll-telling** — Les sites racontent des histoires au scroll.\n\n**9. Variable fonts partout** — Une seule police, mille expressions.\n\n**10. Dark mode premium** — Le dark mode n'est plus un simple inversement de couleurs.",
            image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1400&h=900&fit=crop&q=80",
            category: "tendances"
        },
        {
            title: "La Renaissance des Newsletters",
            excerpt: "Pourquoi le format newsletter connaît un essor sans précédent à l'ère des réseaux sociaux.",
            content: "Face à la saturation des flux algorithmiques, les newsletters offrent un espace de lecture curé, intime et sans distraction.\n\n## Un refuge face au bruit\n\nLes réseaux sociaux sont devenus des machines à générer du bruit. La newsletter, elle, arrive dans votre boîte mail — un espace qui vous appartient.\n\n## L'économie des créateurs\n\nSubstack, Beehiiv, Ghost, ConvertKit — les outils se multiplient et démocratisent la création de newsletters.\n\n## Les chiffres parlent\n\n- Le marché des newsletters a crû de **300%** entre 2020 et 2025\n- Le taux d'ouverture moyen dépasse **55%**\n- **72%** des lecteurs préfèrent recevoir du contenu par email\n\n## Pourquoi ça marche ?\n\n**L'intimité** — Une newsletter, c'est une conversation directe.\n\n**La régularité** — Le rendez-vous hebdomadaire crée une habitude.\n\n**La curation** — Le filtre éditorial est un luxe.",
            image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1400&h=900&fit=crop&q=80",
            category: "culture"
        },
        {
            title: "L'IA au Service de la Créativité",
            excerpt: "Comment les outils d'intelligence artificielle transforment le processus créatif sans le remplacer.",
            content: "L'intelligence artificielle n'est pas venue remplacer les créatifs — elle est venue leur donner des super-pouvoirs.\n\n## Un assistant, pas un remplaçant\n\nL'erreur serait de voir l'IA comme un outil de remplacement. Les studios les plus innovants l'utilisent comme un catalyseur de créativité.\n\n## Les outils qui changent la donne\n\n- **Midjourney et DALL-E 3** pour l'exploration visuelle rapide\n- **Claude et GPT-4** pour la rédaction et la structuration d'idées\n- **Runway et Pika** pour la vidéo générative\n- **Suno et Udio** pour la création musicale\n\n## Le workflow hybride idéal\n\n**Phase 1 : Exploration** — Utilisez l'IA pour générer un maximum d'idées.\n\n**Phase 2 : Sélection** — C'est ici que l'expertise humaine intervient.\n\n**Phase 3 : Raffinement** — Affinez manuellement les directions sélectionnées.\n\n**Phase 4 : Production** — Finalisez les livrables avec vos outils traditionnels.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=900&fit=crop&q=80",
            category: "digital"
        },
        {
            title: "Le Retour du Print",
            excerpt: "Pourquoi les magazines papier et les livres physiques connaissent un regain d'intérêt inattendu.",
            content: "Dans un monde saturé d'écrans, le papier redevient un objet de désir. Magazines indépendants, livres d'artistes, zines — le print n'a jamais été aussi vivant.\n\n## Le luxe de la déconnexion\n\nTenir un magazine dans ses mains, tourner les pages, sentir l'encre — c'est une expérience sensorielle complète que le numérique ne peut pas reproduire.\n\n## Les nouveaux acteurs du print\n\n**Offscreen Magazine** explore la relation entre technologie et humanité. **Weapons of Reason** décortique les grands enjeux contemporains. **Drift** raconte les cultures du café à travers le monde.\n\n## Le mouvement des zines\n\nLe zine connaît une renaissance spectaculaire. Les festivals de zines se multiplient dans toutes les grandes villes.\n\n## Pourquoi le print a de l'avenir\n\nUn monde où tout est numérique rend le physique précieux.",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=900&fit=crop&q=80",
            category: "culture"
        },
        {
            title: "Design System : Guide Complet",
            excerpt: "Tout ce qu'il faut savoir pour construire un design system robuste et évolutif en 2026.",
            content: "Un design system n'est pas juste une bibliothèque de composants. C'est un langage partagé entre designers et développeurs.\n\n## Les piliers d'un design system\n\n**1. Les tokens** — Couleurs, typographies, espacements, ombres.\n\n**2. Les composants** — Boutons, inputs, cartes, modales.\n\n**3. Les patterns** — Comment les composants s'assemblent.\n\n**4. La documentation** — Un design system sans documentation est un design system mort.\n\n## Comment démarrer\n\n**Étape 1 : L'audit visuel** — Capturez chaque variation de chaque élément UI.\n\n**Étape 2 : Les tokens fondamentaux** — Définissez votre palette, typo et espacement.\n\n**Étape 3 : Les composants critiques** — Boutons, inputs et cartes en premier.\n\n**Étape 4 : La gouvernance** — Qui maintient le design system ?",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&h=900&fit=crop&q=80",
            category: "tendances"
        }
    ];

    const { error: newsError } = await supabase.from('news').insert(articles);
    if (newsError) {
        console.error('❌ Erreur insertion articles:', newsError.message);
    } else {
        console.log(`✅ ${articles.length} articles insérés`);
    }

    // --- Community Threads ---
    const threads = [
        {
            title: 'Quel est votre outil créatif préféré en 2026 ?',
            author: 'Marie L.',
            content: "Je suis curieuse de savoir quels outils vous utilisez au quotidien pour vos projets créatifs. Personnellement, je suis passée à Figma + Framer et je ne reviendrais en arrière pour rien au monde !"
        },
        {
            title: 'Recommandations de lectures pour le weekend',
            author: 'Thomas B.',
            content: 'Partageons nos meilleures lectures de la semaine ! Je viens de terminer "Thinking in Systems" de Donella Meadows — absolument brillant.'
        }
    ];

    const { data: insertedThreads, error: threadsError } = await supabase
        .from('threads')
        .insert(threads)
        .select('id');
    if (threadsError) {
        console.error('❌ Erreur insertion threads:', threadsError.message);
    } else {
        console.log(`✅ ${threads.length} threads insérés`);

        // --- Replies ---
        const replies = [
            {
                thread_id: insertedThreads[0].id,
                author: 'Lucas D.',
                content: "Figma est incroyable ! J'utilise aussi Notion pour organiser tout mon workflow créatif."
            },
            {
                thread_id: insertedThreads[1].id,
                author: 'Sophie R.',
                content: 'Excellent choix ! Je recommande aussi "Atomic Habits" de James Clear pour la productivité.'
            }
        ];

        const { error: repliesError } = await supabase.from('replies').insert(replies);
        if (repliesError) {
            console.error('❌ Erreur insertion replies:', repliesError.message);
        } else {
            console.log(`✅ ${replies.length} réponses insérées`);
        }
    }

    console.log('\n🎉 Seed terminé !');
}

seed().catch(console.error);
