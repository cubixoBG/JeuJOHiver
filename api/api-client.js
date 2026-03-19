async function fetchQuestion(indexCase) {
    const config = window._env_;
    const caseActuelle = plateauLogique[indexCase % plateauLogique.length]; // Sécurité modulo
    
    const niveaux = ["Facile", "Intermédiaire", "Difficile"];
    const niveauForce = niveaux[Math.floor(Math.random() * niveaux.length)];

    const promptMessage = config.PROMPT_TEMPLATE
        .replace('${theme}', caseActuelle.nom)
        .replace('${subthemes}', caseActuelle.sujets)
        .replace('${difficulty}', niveauForce);

    try {
        const response = await fetch(config.MISTRAL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: config.MODEL,
                messages: [{ role: "user", content: promptMessage }],
                temperature: 0.8,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const rawContent = JSON.parse(data.choices[0].message.content);

        if (rawContent.options) {
            rawContent.options = rawContent.options.map(opt => {
                let texte = (typeof opt === 'object' && opt !== null) ? Object.values(opt)[0] : opt;
                if (typeof texte === 'string') {
                    return texte.replaceAll('*', '').trim();
                }
                return texte;
            });
        }


        if (rawContent.question) {
            rawContent.question = rawContent.question.replaceAll('*', '').trim();
        }

        rawContent.themeNom = caseActuelle.nom;
        rawContent.themeCouleur = window._env_.CATEGORIES[caseActuelle.categorieId].couleur;

        return rawContent; 
    } catch (error) {
        console.error("Erreur API:", error);
        return null; 
    }
}