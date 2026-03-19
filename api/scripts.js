const env = require('./env');
// Fonction pour lancer un dé
function lancerDe() 
{
    const de1 = Math.floor(Math.random() * 6) + 1; // Génère un nombre entre 1 et 6
    console.log("Le joueur a lancé le dé et a obtenu : " + de1);
    return de1;
}


// Génération et stockage du plateau
let plateauLogique = [];

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

