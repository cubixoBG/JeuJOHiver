<!DOCTYPE html>

<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JO Winter - Joueurs</title>
    <link rel="stylesheet" href="styles/general.css">
    <link rel="stylesheet" href="styles/forms.css">
    <script src="../api/env.js"></script>
    <script src="../api/script.js"></script>
</head>

<body>
    <main>
        <section class="form flexCenter">
            <div class="form_Container">
                <div class="form_Container_Header">
                    <h1>OLYMPIA QUIZZ</h1>
                    <p>Collectez les 5 anneaux olympiques pour gagner</p>
                </div>
                <form class="form_Container_Joueur" onsubmit="return false;">
                    <p id="step-label">Joueur 1 sur 5</p>
                    <div class="player_name flexCenter">
                        <p id="joueur1" style="display:none;"></p>
                        <p id="joueur2" style="display:none;"></p>
                        <p id="joueur3" style="display:none;"></p>
                        <p id="joueur4" style="display:none;"></p>
                        <p id="joueur5" style="display:none;"></p>
                    </div>
                    <input type="text" id="name-input" placeholder="Nom du Joueur">
                    <button id="next-btn">Suivant →</button>
                    <button id="start-btn" style="display:none;">🥇 Commencer la partie</button>
                </form>
            </div>
        </section>
    </main>

    <script>
        const nbTotal = parseInt(localStorage.getItem('temp_nb_joueurs')) || 1;
        const pseudos = [];
        const label = document.getElementById('step-label');
        const input = document.getElementById('name-input');
        const nextBtn = document.getElementById('next-btn');
        const startBtn = document.getElementById('start-btn');

        label.innerText = `Joueur 1 sur ${nbTotal}`;

        for (let i = 1; i <= 5; i++) {
            document.getElementById(`joueur${i}`).style.display = i <= nbTotal ? 'block' : 'none';
        }

        nextBtn.addEventListener('click', () => {
            const val = input.value.trim();
            if (val === "") return;

            pseudos.push(val);
            document.getElementById(`joueur${pseudos.length}`).innerText = val;

            if (pseudos.length < nbTotal) {
                label.innerText = `Joueur ${pseudos.length + 1} sur ${nbTotal}`;
                input.value = "";
            } else {
                label.innerText = "Tous les joueurs sont prêts !";
                input.style.display = "none";
                nextBtn.style.display = "none";
                startBtn.style.display = "block";
            }
        });

        startBtn.addEventListener('click', () => {
            initialiserJoueurs(pseudos);
            genererPlateau(30);
            window.location.href = "jeu.php";
        });
    </script>
</body>

</html>