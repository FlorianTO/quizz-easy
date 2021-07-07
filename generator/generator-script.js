var loader = setInterval(function() {
    if (document.readyState !== "complete") return;
    clearInterval(loader);
    newQuizz();
}, 300);

var fileName = "";
var json = {
    name: "",
    description: "",
    display_hints: false,
    questions: [

    ]
};

function newQuizz() {
    var dom = document.getElementById("questions");

    var fileNameElement = document.getElementById("file-name");
    fileNameElement.onchange = function(ev) { fileName = ev.target.value; };

    var quizzName = document.getElementById("quizz-name");
    quizzName.onchange = function(ev) { json.name = ev.target.value; };

    var quizzDescription = document.getElementById("quizz-description");
    quizzDescription.onchange = function(ev) { json.description = ev.target.value; };

    var quizzHints = document.getElementById("quizz-hints");
    quizzHints.onchange = function(ev) { json.display_hints = ev.target.value; };

    var buttonAddQuestion = document.getElementById("button-add-question");
    var selectQuestionType = document.getElementById("select-type");

    buttonAddQuestion.onclick = function(ev) {
        if (selectQuestionType.value == "QCM")
            addQCMForm(dom);
        //else if (selectQuestionType.value == "OPEN")

        //else if (selectQuestionType.value == "LINKED")

    }
}

function addQCMForm(dom) {
    var idQuestion = json.questions.length;
    json.questions.push({
        type: "QCM",
        name: "",
        hints: [],
        optionals: [],
        answers: [],
        solution: []
    });

    var li = createLiNode(`question-${idQuestion}`, "qcm", dom);
    var divForm = createDivNode(`question-${idQuestion}-div`, "", li);

    displayTitleNode("QCM", "h3", `question-${idQuestion}-title`, divForm);

    var divName = createDivNode(`question-${idQuestion}-name`, "", divForm);
    displayTextNode("Intitulé", `question-${idQuestion}-name-label`, divName);
    var inputName = createInput("", `question-${idQuestion}-name-input`, "", "text", true, divName, [{ name: "change", action: function(ev) { json.questions[idQuestion].name = ev.target.value; } }]);

    var hintCount = 0;
    var divHints = createDivNode(`question-${idQuestion}-hints`, "", divForm);
    displayTextNode("Indices", `question-${idQuestion}-hints-label`, divHints);
    var divHintsDisplay = createDivNode(`question-${idQuestion}-hints-prompt`, "", divHints);
    var inputHint = createInput("", `question-${idQuestion}-hints-input`, "", "text", false, divHints, [{
        name: "keyup",
        action: function(ev) {
            if (ev.key === "Enter") {
                json.questions[idQuestion].hints.push(ev.target.value);
                var divHintsDisplayHint = createDivNode(`question-${idQuestion}-hints-prompt-hint-${hintCount}`, "", divHintsDisplay);
                var hintText = displayTextNode(ev.target.value, `question-${idQuestion}-hints-prompt-hint-${hintCount}-value`, divHintsDisplayHint);
                createInput("remove hint", `question-${idQuestion}-hints-prompt-hint-${hintCount}-remove`, "", "button", false, divHintsDisplayHint, [{
                    name: "click",
                    action: function(ev) {
                        json.questions[idQuestion].hints = json.questions[idQuestion].hints.filter(e => e !== hintText.textContent);
                        divHintsDisplayHint.remove();
                    }
                }]);
            }
        }
    }]);
}

function createInput(name, id, classe, type, isRequired, dom, on) {
    var input = document.createElement('input');
    if (name != null && name != "") input.name = name;
    input.type = type;
    input.required = isRequired;
    if (classe != "" && classe != null) input.classList.add(classe);
    input.id = id;
    if (on != null && on != [])
        on.forEach(function(event, index) {
            input.addEventListener(event.name, event.action);
        });
    dom.appendChild(input);
    return input;
}

function createLiNode(id, classe, dom) {
    var liNode = document.createElement('li');
    liNode.id = id;
    liNode.classList.add(classe);
    dom.appendChild(liNode);
    return liNode;
}

function createDivNode(id, classe, dom) {
    var divNode = document.createElement("div");
    divNode.id = id;
    divNode.className = classe;
    dom.appendChild(divNode);
    return divNode;
}

function displayTextNode(text, id, dom) {
    var textNode = document.createTextNode(text);
    textNode.id = id;
    dom.appendChild(textNode);
    return textNode;
}

function displayTitleNode(text, textType, id, dom) {
    //Element de type h (h1, h2, etc)
    var h = document.createElement(textType);
    var textNode = document.createTextNode(text);
    h.appendChild(textNode);
    h.id = id;
    dom.appendChild(h);
}