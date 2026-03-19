async function fetchQuestionDynamique(indexCase) {
    const config = window._env_;
    const caseActuelle = plateauLogique[indexCase];
    
    const difficultes = ["Facile", "Intermédiaire", "Expert"];
    const diff = difficultes[Math.floor(Math.random() * difficultes.length)];

    const promptMessage = config.PROMPT_TEMPLATE
        .replace('${theme}', caseActuelle.nom)
        .replace('${subthemes}', caseActuelle.sujets)
        .replace('${difficulty}', diff);

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
                temperature: config.TEMPERATURE,
                max_tokens: config.MAX_TOKENS,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();

        return JSON.parse(data.choices[0].message.content);
    } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
        return null; 
    }
}