// --- LOGIQUE DE TEST (FRONT PROVISOIRE) ---
        
        // Au chargement, on prépare le plateau visuel
        window.addEventListener('load', () => {
            if (!chargerPartie()) {
                initialiserJoueurs(["Hugo", "Mame"]);
                genererPlateau(20);
            }
            dessinerPlateau();
            refreshUI();
        });

        function dessinerPlateau() {
            const board = document.getElementById('board');
            board.innerHTML = "";
            plateauLogique.forEach((c, i) => {
                const div = document.createElement('div');
                div.className = 'case';
                div.style.backgroundColor = window._env_.CATEGORIES[c.categorieId].couleur;
                div.id = 'case-' + i;
                div.innerText = i;
                board.appendChild(div);
            });
            placerPion();
        }

        function placerPion() {
            // Supprimer l'ancien pion
            const oldPion = document.querySelector('.pion');
            if(oldPion) oldPion.remove();
            
            // Placer le pion sur la case actuelle du joueur actif
            const j = gameState.joueurs[gameState.indexJoueurActif];
            const caseDest = document.getElementById('case-' + j.position);
            const pion = document.createElement('div');
            pion.className = 'pion';
            caseDest.appendChild(pion);
        }

        async function lancerLeTour() {
            document.getElementById('btn-de').disabled = true;
            const de = lancerDe();
            let j = gameState.joueurs[gameState.indexJoueurActif];
            
            // On avance
            j.position = (j.position + de) % plateauLogique.length;
            placerPion();
            refreshUI();

            // On appelle ton API Client
            const questionData = await fetchQuestion(j.position);
            afficherQuiz(questionData);
        }

function afficherQuiz(data) {
    const box = document.getElementById('quiz-box');
    document.getElementById('q-titre').innerHTML = `
        <span style="color:${data.themeCouleur}">${data.themeNom}</span><br>
        ${data.question} <br>
        <small>Difficulté : ${data.difficulty}</small>
    `;
    
    const options = document.getElementById('q-options');
    options.innerHTML = "";
    
    data.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-reponse';
        btn.innerText = opt;
        btn.onclick = () => verifierReponse(index, data.answer);
        options.appendChild(btn);
    });
    box.style.display = 'block';
}

        function verifierReponse(choix, correct) {
            const catId = plateauLogique[gameState.joueurs[gameState.indexJoueurActif].position].categorieId;
            
            if(choix === correct) {
                alert("Bonne réponse !");
                enregistrerVictoireCase(catId); // TA FONCTION
            } else {
                alert("Faux !");
            }

            document.getElementById('quiz-box').style.display = 'none';
            document.getElementById('btn-de').disabled = false;
            passerAuJoueurSuivant(); // TA FONCTION
            refreshUI();
            placerPion();
        }

        function refreshUI() {
            const j = gameState.joueurs[gameState.indexJoueurActif];
            document.getElementById('nom-joueur').innerText = j.nom;
            document.getElementById('pos-joueur').innerText = j.position;
            document.getElementById('rings-count').innerText = j.anneaux.filter(a => a).length;
        }