var json = [{
    name: "Quizz de test",
    description: "L'objectif de ce quizz est de tester la bibliothèque JS",
    display_hints: true,
    element_id: "quizz-app",
    questions: [
        {
            type: "QCM",
            name: "Combien font 2+3 ?",
            hints: ["indice1","indice2", "indice 3", "indice 4"],
            optionals: [
                {
                    type: "IMAGE",
                    link: "",
                    sizeX: 0,
                    sizeY: 0
                },
                {
                    type: "CODE",
                    content: ""
                },
                {
                    type: "VIDEO",
                    link: ""
                },
                {
                    type: "AUDIO",
                    link: ""
                }
            ],
            answers: ["1","7", "5"],
            solution: [3]
        },
        {
            type: "OPEN",
            name: "Qui est le PDG de Microsoft ? (Prénom et nom)",
            hints: ["Son nom est la traduction anglaise de 'portails'"],
            optionals: [],
            solution: "Bill Gates",
            caseSensitive: false
        },
        {
            type: "LINKED",
            name: "Associer chaque animal à sa catégorie",
            hints: ["",""],
            optionals: [],
            answers: ["Reptile", "Félin", "Singe"],
            solution: ["Serpent", "Tigre", "Gorille"]
        }
    ]
}];
