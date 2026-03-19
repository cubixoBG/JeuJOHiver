// État par défaut du joueur (max 5 joueurs)
let gameState = {
    joueurs: [], // Tableau pour stocker de 1 à 5 joueurs
    indexJoueurActif: 0, 
    plateau: [], 
    difficulteActuelle: "Moyen",
    derniereMiseAJour: new Date().toISOString()
};

// Génération et stockage du plateau
let plateauLogique = [];

// Fonction pour initialiser les joueurs
function initialiserJoueurs(noms) {
    gameState.joueurs = noms.map((nom, index) => ({
        id: index,
        nom: nom,
        position: 0,
        score: 0,
        // Chaque index correspond à une catégorie de la config
        anneaux: [false, false, false, false, false] 
    }));
    sauvegarderPartie();
}

// Fonction pour lancer un dé
function lancerDe() 
{
    const de1 = Math.floor(Math.random() * 6) + 1; // Génère un nombre entre 1 et 6
    console.log("Le joueur a lancé le dé et a obtenu : " + de1);
    
    return de1;
}

function genererPlateau(nombreDeCases) {
    const categories = window._env_.CATEGORIES;
    for (let i = 0; i < nombreDeCases; i++) {
        // Choix random d'une catégorie pour la case
        const catAleatoire = categories[Math.floor(Math.random() * categories.length)];
        plateauLogique.push({
            id: i,
            categorieId: catAleatoire.id,
            nom: catAleatoire.nom,
            sujets: catAleatoire.sujets.join(", ")
        });
    }
    gameState.plateau = plateauLogique; // On synchronise avec le gameState
    localStorage.setItem('jo_plateau', JSON.stringify(plateauLogique));
}

// Check si le mec a déjà gagné ou pas
function verifierVictoire(joueur) {
    // joueur.anneaux = tableau de booléens [false, false, false, false, false]
    const aGagne = joueur.anneaux.every(statut => statut === true);
    
    if (aGagne) {
        console.log("BRAVO ! Tous les anneaux collectés !");
    }
    return aGagne;
}

function attribuerAnneau(joueur, categorieId) {
    if (!joueur.anneaux[categorieId]) {
        joueur.anneaux[categorieId] = true;
        
        sauvegarderLocalement(joueur);
        return true;
    }
    return false; 
}

function enregistrerVictoireCase(categorieId) {
    // On récupère le joueur dont c'est le tour
    let joueur = gameState.joueurs[gameState.indexJoueurActif];
    
    joueur.score += 10;
    if (!joueur.anneaux[categorieId]) {
        joueur.anneaux[categorieId] = true;
        console.log(`Anneau catégorie ${categorieId} obtenu !`);
    }
    sauvegarderPartie();
    if (joueur.anneaux.every(a => a === true)) {
        console.log("VICTOIRE TOTALE : Les 5 anneaux sont là.");
    }
}

// Fonction pour passer au joueur suivant
function passerAuJoueurSuivant() {
    gameState.indexJoueurActif = (gameState.indexJoueurActif + 1) % gameState.joueurs.length;
    sauvegarderPartie();
}

// Sauvegarde dans le localStorage
function sauvegarderLocalement(joueur) {
    const dataString = JSON.stringify(gameState);
    
    localStorage.setItem('olympique_game_data', dataString);
    
    console.log("Jeu sauvegardé dans le localStorage !");
}

// Fonction de sauvegarde
function sauvegarderPartie() {
    const dataString = JSON.stringify(gameState);
    
    localStorage.setItem('olympique_game_data', dataString);
    
    console.log("Jeu sauvegardé dans le localStorage !");
}

// Charger la partie existante
function chargerPartie() {
    const savedData = localStorage.getItem('olympique_game_data');
    
    if (savedData) {

        gameState = JSON.parse(savedData);
        // On récupère aussi le plateau s'il était stocké à part
        const savedPlateau = localStorage.getItem('jo_plateau');
        if(savedPlateau) plateauLogique = JSON.parse(savedPlateau);
        
        console.log("Partie récupérée :", gameState);
        return true;
    }
    
    console.log("Aucune sauvegarde trouvée, nouvelle partie.");
    return false;
}

function configurerPseudos() {
    const nb = document.getElementById('nb-joueurs').value;
    const container = document.getElementById('pseudo-inputs');
    container.innerHTML = "<h3>Entrez les pseudos :</h3>";

    // On limite entre 1 et 5 par sécurité
    const count = Math.max(1, Math.min(5, nb));

    for (let i = 1; i <= count; i++) {
        container.innerHTML += `
            <div style="margin: 10px;">
                Joueur ${i} : <input type="text" class="input-pseudo" placeholder="Pseudo..." value="Joueur ${i}">
            </div>
        `;
    }

    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}


function demarrerLeJeu() {
    const inputs = document.querySelectorAll('.input-pseudo');
    const pseudos = [];

    inputs.forEach(input => {
        if (input.value.trim() !== "") {
            pseudos.push(input.value.trim());
        }
    });

    initialiserJoueurs(pseudos);
    genererPlateau(30);

    document.getElementById('setup-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    if (typeof updateUI === "function") updateUI();
    if (typeof dessinerPlateau === "function") dessinerPlateau();
}

window.onload = () => {

    if (chargerPartie()) {
        console.log("Une sauvegarde a été trouvée. Reprise de la partie...");
        

        document.getElementById('setup-menu').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        

        if (typeof updateUI === "function") updateUI();
        if (typeof dessinerPlateau === "function") dessinerPlateau();
    } else {
        console.log("Aucune sauvegarde. Affichage du menu de configuration.");

        document.getElementById('setup-menu').style.display = 'block';
        document.getElementById('game-container').style.display = 'none';
    }
};