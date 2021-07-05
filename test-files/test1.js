var json = {
    name: "Quizz de test",
    description: "L'objectif de ce quizz est de tester la bibliothèque JS",
    display_hints: true,
    questions: [
        {
            type: "QCM",
            name: "Combien font 2+3 ?",
            hints: ["indice1","indice2"],
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
            name: "Quel est le prénom de Mr.GUIBERT ?",
            hints: ["commence par un O","Est le nom d'une plante"],
            optionals: [],
            solution: "Olivier",
            caseSensitive: false
        },
        {
            type: "LINKED",
            name: "Lier chaque mot à son synonyme",
            hints: ["",""],
            optionals: [],
            answers: ["oui", "non"],
            solution: ["certainement", "bof"]
        }
    ]
};