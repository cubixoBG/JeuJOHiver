<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JO Winter - En piste !</title>
    <link rel="stylesheet" href="styles/general.css">
    <link rel="stylesheet" href="styles/plateau.css">
    <link rel="icon" href="images/favicon.ico" />
</head>

<body>
    <main>
        <div id="lab-container">
            <h1>LAB TEST - BACKEND JO</h1>

            <div class="stats">
                <div>Joueur : <span id="nom-joueur">-</span></div>
                <div>Case : <span id="pos-joueur">0</span></div>
                <div>Anneaux : <span id="rings-count">0</span>/5</div>
            </div>

            <div id="board" class="plateau-visuel"></div>

            <button onclick="lancerLeTour()" id="btn-de"
                style="padding: 15px 30px; font-size: 1.2em; cursor: pointer; margin: 10px;">🎲 Lancer le dé</button>

            <div id="quiz-box">
                <h3 id="q-titre">Question...</h3>
                <div id="q-options"></div>
            </div>

            <button onclick="resetPartie()"
                style="margin-top: 30px; background: #e74c3c; color: white; border: none; padding: 5px 10px; cursor: pointer;">Réinitialiser
                tout</button>
        </div>
    </main>
</body>
<script src="scripts/plateau.js"></script>
<script src="/api/env.js"></script>
<script src="/api/api-client.js"></script>
<script src="/api/script.js"></script>

</html>