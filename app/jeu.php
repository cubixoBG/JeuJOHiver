<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Olympia Quizz</title>
  <link rel="stylesheet" href="styles/general.css">
  <link rel="stylesheet" href="styles/plateau.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      display: flex;
      flex-direction: row;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background: #f0f2f5;
      font-family: "Segoe UI", sans-serif;
    }

    #sidebar {
      width: 220px;
      min-width: 220px;
      height: 100vh;
      background: #fff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      padding: 16px 12px;
      gap: 12px;
      overflow-y: auto;
      flex-shrink: 0;
    }

    #board-wrap {
      flex: 1;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      overflow: hidden;
    }

    #board-wrap canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>

<aside id="sidebar">
  <div id="sidebar-header">
    <canvas id="c-logo-rings" width="156" height="30"></canvas>
    <p id="sidebar-title">OLYMPIA QUIZZ</p>
  </div>
  <div id="players-list"></div>
  <div id="dice-section">
    <canvas id="c-dice" width="60" height="60"></canvas>
    <button id="btn-roll" onclick="lancerLeTour()">🎲 Lancer le dé</button>
    <span id="lien-new-game" onclick="window.location.href='index.php'">Nouvelle partie</span>
  </div>
</aside>

<main id="board-wrap">
  <canvas id="c-board"></canvas>
</main>

<div id="quiz-overlay" class="hidden">
  <div id="quiz-card">
    <div id="quiz-badge"></div>
    <h2 id="quiz-question"></h2>
    <p id="quiz-diff"></p>
    <div id="quiz-opts"></div>
  </div>
</div>

<div id="victoire-overlay" class="hidden">
  <div id="victoire-card">
    <canvas id="c-victoire-rings" width="200" height="60"></canvas>
    <h1 id="victoire-titre">🥇 Victoire !</h1>
    <p id="victoire-nom"></p>
    <button onclick="resetPartie()">🔁 Rejouer</button>
  </div>
</div>

<script src="../api/env.js"></script>
<script src="../api/api-client.js"></script>
<script src="../api/script.js"></script>
<script src="scripts/plateau.js"></script>

<script>
let rolling = false;

function updateUI() {
  drawLogoRings();
  drawDice(null);
  renderSidebar();
  drawBoard();
}

function dessinerPlateau() {
  drawBoard();
}

window.addEventListener('resize', () => {
  if (typeof gameState !== 'undefined' && gameState.joueurs.length) drawBoard();
});

async function lancerLeTour() {
  if (rolling) return;
  rolling = true;
  document.getElementById('btn-roll').disabled = true;

  let count = 0;
  const anim = setInterval(() => {
    drawDice(Math.ceil(Math.random() * 6));
    if (++count >= 10) {
      clearInterval(anim);

      const de = lancerDe();
      drawDice(de);

      const j = gameState.joueurs[gameState.indexJoueurActif];
      j.position = (j.position + de) % plateauLogique.length;
      sauvegarderPartie();

      drawBoard();
      renderSidebar();

      fetchQuestion(j.position).then(data => {
        rolling = false;
        if (!data) {
          console.error("Impossible de charger la question, tour ignoré.");
          document.getElementById('btn-roll').disabled = false;
          passerAuJoueurSuivant();
          renderSidebar();
          drawBoard();
          return;
        }
        showQuiz(data);
      });
    }
  }, 55);
}

function showQuiz(data) {
  const badge = document.getElementById('quiz-badge');
  badge.textContent       = data.themeNom    || 'Thème';
  badge.style.color       = data.themeCouleur || '#0085C7';
  badge.style.borderColor = data.themeCouleur || '#0085C7';

  document.getElementById('quiz-question').textContent = data.question   || '';
  document.getElementById('quiz-diff').textContent     = 'Difficulté : ' + (data.difficulty || '?');

  const opts = document.getElementById('quiz-opts');
  opts.innerHTML = '';
  (data.options || []).forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className   = 'btn-reponse';
    btn.textContent = opt;
    btn.onclick     = () => verifyAnswer(i, data.answer, data.themeCouleur);
    opts.appendChild(btn);
  });

  document.getElementById('quiz-overlay').classList.remove('hidden');
}

function verifyAnswer(choix, correct, couleur) {
  const j     = gameState.joueurs[gameState.indexJoueurActif];
  const catId = plateauLogique[j.position % plateauLogique.length].categorieId;
  const opts  = document.querySelectorAll('.btn-reponse');

  if (choix === correct) {
    if (opts[choix]) opts[choix].style.background = '#22c55e';
    enregistrerVictoireCase(catId);

    setTimeout(() => {
      document.getElementById('quiz-overlay').classList.add('hidden');
      if (verifierVictoire(j)) {
        afficherVictoire(j);
        return;
      }
      passerAuJoueurSuivant();
      document.getElementById('btn-roll').disabled = false;
      renderSidebar();
      drawBoard();
    }, 700);
  } else {
    if (opts[choix])   opts[choix].style.background   = '#ef4444';
    if (opts[correct]) opts[correct].style.background = '#22c55e';

    setTimeout(() => {
      document.getElementById('quiz-overlay').classList.add('hidden');
      passerAuJoueurSuivant();
      document.getElementById('btn-roll').disabled = false;
      renderSidebar();
      drawBoard();
    }, 1200);
  }
}

function afficherVictoire(joueur) {
  document.getElementById('victoire-overlay').classList.remove('hidden');
  document.getElementById('victoire-nom').textContent =
    `🎉 Félicitations ${joueur.nom}, tu as collecté les 5 anneaux !`;
  const c = document.getElementById('c-victoire-rings');
  drawRingsCtx(c.getContext('2d'), 100, 30, 14, OC);
}

function resetPartie() {
  const noms = gameState.joueurs.map(j => j.nom);
  initialiserJoueurs(noms);
  genererPlateau(30);
  drawDice(null);
  document.getElementById('btn-roll').disabled = false;
  document.getElementById('quiz-overlay').classList.add('hidden');
  document.getElementById('victoire-overlay').classList.add('hidden');
  renderSidebar();
  drawBoard();
}
</script>
</body>
</html>