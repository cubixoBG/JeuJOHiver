<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JO Winter - choix joueurs</title>
    <link rel="stylesheet" href="styles/general.css">
    <link rel="stylesheet" href="styles/forms.css">
    <link rel="icon" href="images/favicon.ico" />
</head>

<body>
    <main>
        <section class="form flexCenter">
            <div class="form_Container">
                <div class="form_Container_Header">
                    <h1>OLYMPIA QUIZZ</h1>
                    <p>Collectez les 5 anneaux olympiques pour gagner</p>
                </div>
                <script src="../api/env.js"></script>
                <script src="../api/script.js"></script>
                <div class="form_Container_Save">
                    <button>
                        <p>▶ Reprendre la partie sauvegardée</p>
                    </button>
                </div>
                <div class="form_Container_Choix">
                    <span>Combiens de joueurs ?</span>
                    <form class="rings">
                        <div class="row">
                            <canvas id="j1" width="90" height="90"></canvas>
                            <canvas id="j2" width="90" height="90"></canvas>
                            <canvas id="j3" width="90" height="90"></canvas>
                        </div>
                        <div class="row">
                            <canvas id="j4" width="90" height="90"></canvas>
                            <canvas id="j5" width="90" height="90"></canvas>
                        </div>
                    </form>
                    <button id="btn-valid-nb" style="display:none;" onclick="validerNombreJoueurs()">Suivant →</button>
                </div>
            </div>
        </section>
    </main>
</body>
<script src="scripts/canvas.js"></script>

</html>