var JSON_FILE = './test-files/test1.json';
var DISPLAY_HINTS = true; //true : hints are displayed //false : hints aren't displayed
var MAIN_TITLE_TYPE = "h1"; //h1 to h6
var QUESTION_TITLE_TYPE = "h2"; //h1 to h6
var NORMAL_TEXT_TYPE = "p";

var QUESTION_QCM = "QCM", 
    QUESTION_OPEN = "OPEN", 
    QUESTION_LINKED = "LINKED";

var ELEMENT_BUTTON = "button";

var ID_MAIN_DIV = "quizz-app", 
    ID_MAIN_TITLE = "quizz-app-name", 
    ID_MAIN_DESCRIPTION = "quizz-app-description", 
    ID_MAIN_QUESTIONS = "quizz-app-questions";

var loader = setInterval(function () {
    if(document.readyState !== "complete") return;
    clearInterval(loader);
    getJSON();
}, 300);

function createNewQuizz(jsonObject) {
    var dom = document.getElementById(ID_MAIN_DIV);
    console.log(dom);

	displayTitleNode(jsonObject.name, MAIN_TITLE_TYPE, ID_MAIN_TITLE, dom);

	displayTextNode(jsonObject.description, ID_MAIN_DESCRIPTION, dom);

    var quizzQuestions = jsonObject.questions;
    var divQuestions = createDivNode(ID_MAIN_QUESTIONS, dom);

    quizzQuestions.forEach(function(question, index) {
        if(question.type == QUESTION_QCM)
            createNewQCM(question, divQuestions, index);
        else if(question.type == QUESTION_OPEN)
            createNewOpen(question, divQuestions, index);
        else if(question.type == QUESTION_LINKED)
            createNewLinked(question, divQuestions, index);
    });

    createButton("Valider", ID_MAIN_VALIDATE, dom, validateQuizz);
}

function createNewQCM(question, dom, questionId) {
	displayTitleNode(question.name, QUESTION_TITLE_TYPE, "quizz-app-questions-" + questionId + "-name", dom);

	if(DISPLAY_HINTS)
        displayHints(question.hints, questionId, dom);

    var questionAnswers = question.answers;
    var divAnswers = createDivNode("quizz-app-questions-" + questionId + "-answers", dom);

    questionAnswers.forEach(function(answer, index) {
        var divAnswer = createDivNode("quizz-app-questions-" + questionId + "-answers-" + index, divAnswers);
        
        var checkboxAnswer = document.createElement("input");
        checkboxAnswer.type = "checkbox";
        checkboxAnswer.id = "quizz-app-questions-" + questionId + "-answers-" + index + "-checkbox";
        divAnswer.appendChild(checkboxAnswer);

		displayTextNode(answer, "quizz-app-questions-" + questionId + "-answers-" + index + "-text", divAnswer);
    });
}

function createNewOpen(question, dom, questionId) {
	displayTitleNode(question.name, QUESTION_TITLE_TYPE, "quizz-app-questions-" + questionId + "-name", dom);

    if(DISPLAY_HINTS)
        displayHints(question.hints, questionId, dom);

    var inputSolution = document.createElement("input");
    inputSolution.type = "text";
    inputSolution.required = true;
    dom.appendChild(inputSolution); 
}

function createNewLinked(question, dom, questionId) {
    displayTitleNode(question.name, QUESTION_TITLE_TYPE, "quizz-app-questions-" + questionId + "-name", dom);

    if(DISPLAY_HINTS)
        displayHints(question.hints, questionId, dom);

    var questionAnswers = question.answers;
    var questionSolutions = shuffle(question.solution);
	var divAnswersAndSolutions = createDivNode("quizz-app-questions-" + questionId + "-answersAndSolutions", dom);

    questionAnswers.forEach(function(answer, index) {
		var divAnswer = createDivNode("quizz-app-questions-" + questionId + "-answers-" + index, divAnswersAndSolutions);
        
        displayTextNode(answer, "quizz-app-questions-" + questionId + "-answers-" + index + "-text", divAnswer);

        var inputSolution = document.createElement("select");
        inputSolution.id = "quizz-app-questions-" + questionId + "-answers-" + index + "-select";
        divAnswer.appendChild(inputSolution);

        for (var i = 1; i <= questionAnswers.length; i++) {
            var option = document.createElement("option");
            option.value = i;
            option.text = i;
            inputSolution.appendChild(option);
        }

		displayTextNode(questionSolutions[index], "quizz-app-questions-" + questionId + "-answers-" + index + "-textSolution", divAnswer);
    });
}

function displayTextNode(text, id, dom) {
	var textNode = document.createTextNode(text);
	textNode.id = id;
	dom.appendChild(textNode);
}

function displayTitleNode(text, textType, id, dom) {
    //Element de type h (h1, h2, etc)
    var h = document.createElement(textType); 
    var textNode = document.createTextNode(text);
    h.appendChild(textNode);
    h.id = id;
    dom.appendChild(h);
}

function displayHints(hints, questionId, dom) {
	if(hints.length <= 0) return;

	var divHints = createDivNode("quizz-app-questions-" + questionId + "hints", dom);

	hints.forEach(function(hint, index) {
        if(hint == "") return;
		createButton("Afficher indice " + (index + 1), "quizz-app-questions-" + questionId + "hints-button-" + index, divHints, function() {
			var button = document.getElementById("quizz-app-questions-" + questionId + "hints-button-" + index);
			displayTitleNode(hints[index], NORMAL_TEXT_TYPE, "quizz-app-questions-" + questionId + "hints-" + index, divHints);
			button.remove();
		});
	});
}

function createButton(text, id, dom, onclick) {
	var button = document.createElement("button");
	button.innerHTML = text;
	button.id = id;
	dom.appendChild(button);
	button.addEventListener("click", onclick);
}

function createDivNode(id, dom) {
	var divNode = document.createElement("div");
	divNode.id = id;
	dom.appendChild(divNode);
	return divNode;
}

function getJSON() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
            createNewQuizz(JSON.parse(this.responseText));
    };

    xmlhttp.open("GET", JSON_FILE, true);
    xmlhttp.send(); 
}

function shuffle(array) {
    var currentIndex = array.length, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        var current = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = current;
    }
    return array;
}

/*
function send(array){
    var finalUserArray = [];
    var SolutionArray = [];
    
} 
*/

function validateQuizz() {

}