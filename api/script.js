let gameState = {
    joueurs: [],
    indexJoueurActif: 0, 
    plateau: [], 
    difficulteActuelle: "Moyen",
    questionsPosees: [], // Historique pour éviter les doublons
    derniereMiseAJour: new Date().toISOString()
};

let plateauLogique = [];

function initialiserJoueurs(noms) {
    gameState.joueurs = noms.map((nom, index) => ({
        id: index,
        nom: nom,
        position: 0,
        score: 0,
        anneaux: [false, false, false, false, false] 
    }));
    gameState.questionsPosees = [];
    sauvegarderPartie();
}

function lancerDe() {
    return Math.floor(Math.random() * 6) + 1;
}

function genererPlateau(nombreDeCases) {
    const categories = window._env_.CATEGORIES;
    plateauLogique = [];
    for (let i = 0; i < nombreDeCases; i++) {
        const catAleatoire = categories[Math.floor(Math.random() * categories.length)];
        plateauLogique.push({
            id: i,
            categorieId: catAleatoire.id,
            nom: catAleatoire.nom,
            sujets: catAleatoire.sujets.join(", ")
        });
    }
    gameState.plateau = plateauLogique;
    localStorage.setItem('jo_plateau', JSON.stringify(plateauLogique));
}

function verifierVictoire(joueur) {
    return joueur.anneaux.every(statut => statut === true);
}

function enregistrerVictoireCase(categorieId) {
    let joueur = gameState.joueurs[gameState.indexJoueurActif];
    joueur.score += 10;
    const catIdx = parseInt(categorieId);
    if (joueur.anneaux[catIdx] !== undefined) {
        joueur.anneaux[catIdx] = true;
    }
    sauvegarderPartie();
}

function passerAuJoueurSuivant() {
    gameState.indexJoueurActif = (gameState.indexJoueurActif + 1) % gameState.joueurs.length;
    sauvegarderPartie();
}

function sauvegarderPartie() {
    gameState.derniereMiseAJour = new Date().toISOString();
    localStorage.setItem('olympique_game_data', JSON.stringify(gameState));
}

function chargerPartie() {
    const savedData = localStorage.getItem('olympique_game_data');
    if (savedData) {
        gameState = JSON.parse(savedData);
        if (!gameState.questionsPosees) gameState.questionsPosees = [];
        const savedPlateau = localStorage.getItem('jo_plateau');
        if(savedPlateau) plateauLogique = JSON.parse(savedPlateau);
        return true;
    }
    return false;
}

function clicReprendrePartie() {
    if (chargerPartie()) {
        window.location.href = "jeu.php";
    }
}

async function fetchQuestion(indexCase) {
    const config = window._env_;
    const caseActuelle = plateauLogique[indexCase % plateauLogique.length];
    const catInfo = config.CATEGORIES.find(c => c.id === caseActuelle.categorieId);

    // On récupère les dernières questions pour l'exclusion (évite les doublons)
    const exclus = (gameState.questionsPosees || []).slice(-10).join(", ");

    const promptHiver = `Expert JO d'HIVER uniquement. 
    Thème: ${catInfo.nom} (${catInfo.sujets.join(", ")}). 
    Difficulté demandée: ${gameState.difficulteActuelle}.
    INTERDIT de poser ces questions: [${exclus}].
    JSON: {"question": "...", "options": ["", "", "", ""], "answer": 0, "difficulty": "${gameState.difficulteActuelle}"}`;

    try {
        const response = await fetch(config.MISTRAL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: config.MODEL,
                messages: [
                    { role: "system", content: "Tu es un expert en JO d'HIVER. Tu réponds en JSON court. Tu inclus toujours le champ 'difficulty' dans ton JSON." },
                    { role: "user", content: promptHiver }
                ],
                temperature: 0.6,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const res = JSON.parse(data.choices[0].message.content);


        res.options = res.options.map(o => (typeof o === 'object' ? Object.values(o)[0] : String(o)));
        
        res.difficulty = res.difficulty || gameState.difficulteActuelle;

        if (!gameState.questionsPosees) gameState.questionsPosees = [];
        gameState.questionsPosees.push(res.question);
        sauvegarderPartie();

        res.themeNom = catInfo.nom;
        res.themeCouleur = catInfo.couleur;
        
        return res;

    } catch (e) {
        console.error("Erreur:", e);
        return null;
    }
}

window.onload = () => {
    const btnReprendre = document.querySelector('.form_Container_Save button');
    if (btnReprendre) {
        if (!localStorage.getItem('olympique_game_data')) {
            btnReprendre.style.display = 'none';
        } else {
            btnReprendre.onclick = (e) => { e.preventDefault(); clicReprendrePartie(); };
        }
    }
    if (window.location.pathname.includes("jeu.php")) {
        chargerPartie();
        if (typeof updateUI === "function") updateUI();
    }
};