// env.js
const ENV = {
    MISTRAL_API_KEY: "TA_CLE_API_ICI",
    MISTRAL_URL: "https://api.mistral.ai/v1/chat/completions",
    MODEL: "mistral-tiny",
    
    CATEGORIES: [
        {
            id: 0,
            nom: "Histoire des JO",
            couleur: "jaune",
            sujets: ["Origines anciennes et modernes", "Évolution des Jeux", "Villes hôtes marquantes"]
        },
        {
            id: 1,
            nom: "Disciplines et Épreuves",
            couleur: "vert",
            sujets: ["Disciplines sportives", "Nouvelles épreuves", "Records mémorables"]
        },
        {
            id: 2,
            nom: "Athlètes Légendaires",
            couleur: "bleu",
            sujets: ["Biographies célèbres", "Histoires de résilience", "Impact sur la popularité"]
        },
        {
            id: 3,
            nom: "Impact Social et Culturel",
            couleur: "noir",
            sujets: ["Paix et unité", "Athlètes paralympiques", "Promotion par le sport"]
        },
        {
            id: 4,
            nom: "Défis et Controverses",
            couleur: "rouge",
            sujets: ["Défis logistiques et financiers", "Technologie (chronométrage, diffusion)", "Dopage et boycotts"]
        }
    ],

    PROMPT_TEMPLATE: `Tu es un expert des JO d'Hiver. Génère une question de quiz. 
    Thématique : \${theme}. 
    Sujets précis : \${subthemes}. 
    Difficulté : \${difficulty}.
    Format JSON strict : {"question": "...", "options": ["...", "...", "...", "..."], "answer": 0}`
};

window._env_ = ENV;