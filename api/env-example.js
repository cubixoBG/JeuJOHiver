const ENV = {
    MISTRAL_API_KEY: "",
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

    PROMPT_TEMPLATE: `Tu es un expert des jeux Olympiques d'Hiver. Génère UNE SEULE question précise.
    Thématique : \${theme}.
    Sujets : \${subthemes}.
    
    CONSIGNES STRICTES :
    1. NE POSE QU'UNE SEULE QUESTION (pas de double question).
    2. Choisis une difficulté au hasard parmi [Facile, Intermédiaire, Difficile]. 
    - Si Facile : Question de culture générale (dates, drapeaux).
    - Si Difficile : Question technique ou anecdote peu connue.
    3. Les options doivent être courtes (max 5 mots).
    4. Réponds EXCLUSIVEMENT en JSON :
    {"question": "...", "options": ["...", "...", "...", "..."], "answer": 0, "difficulty": "..."}`
};

window._env_ = ENV;