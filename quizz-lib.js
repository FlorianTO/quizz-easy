var JSON_FILE = './test-files/test1.json';
var DISPLAY_HINTS = true; //true : hints are displayed //false : hints aren't displayed
var MAIN_TITLE_TYPE = "h1"; //h1 to h6
var QUESTION_TITLE_TYPE = "h2"; //h1 to h6

var loader = setInterval(function () {
    if(document.readyState !== "complete") return;
    clearInterval(loader);
    getJSON();
}, 300);

function createNewQuizz(jsonObject) {
    var dom = document.getElementById("quizz-app");

	displayTitleNode(jsonObject.name, MAIN_TITLE_TYPE, "quizz-app-name", dom);

	displayTextNode(jsonObject.description, "quizz-app-description", dom);

    var quizzQuestions = jsonObject.questions;
    var divQuestions = document.createElement("div");
    divQuestions.id = "quizz-app-questions";
    dom.appendChild(divQuestions);

    quizzQuestions.forEach(function(question, index) {
        if(question.type == "QCM")
            createNewQCM(question, divQuestions, index);
        else if(question.type == "OPEN")
            createNewOpen(question, divQuestions, index);
        else if(question.type == "LINKED")
            createNewLinked(question, divQuestions, index);
    });
}

function createNewQCM(question, dom, questionId) {
	displayTitleNode(question.name, QUESTION_TITLE_TYPE, "quizz-app-questions-" + questionId + "-name", dom);

    var questionAnswers = question.answers;
    var divAnswers = document.createElement("div");
    divAnswers.id = "quizz-app-questions-" + questionId + "-answers";
    dom.appendChild(divAnswers);

    questionAnswers.forEach(function(answer, index) {
        var divAnswer = document.createElement("div");
        divAnswer.id = "quizz-app-questions-" + questionId + "-answers-" + index;
        divAnswers.appendChild(divAnswer);
        
        var checkboxAnswer = document.createElement("input");
        checkboxAnswer.type = "checkbox";
        checkboxAnswer.id = "quizz-app-questions-" + questionId + "-answers-" + index + "-checkbox";
        divAnswer.appendChild(checkboxAnswer);

		displayTextNode(answer, "quizz-app-questions-" + questionId + "-answers-" + index + "-text", divAnswer);
    });
}

function createNewOpen(question, dom, questionId) {
	displayTitleNode(question.name, QUESTION_TITLE_TYPE, "quizz-app-questions-" + questionId + "-name", dom);

    var inputSolution = document.createElement("input");
    inputSolution.type = "text";
    inputSolution.required = true;
    dom.appendChild(inputSolution); 
}

function createNewLinked(question, dom, questionId) {
    displayTitleNode(question.name, QUESTION_TITLE_TYPE, "quizz-app-questions-" + questionId + "-name", dom);

    var questionAnswers = question.answers;
    var questionSolutions = shuffle(question.solution);
    var divAnswersAndSolutions = document.createElement("div");
    divAnswersAndSolutions.id = "quizz-app-questions-" + questionId + "-answersAndSolutions";
    dom.appendChild(divAnswersAndSolutions);

    questionAnswers.forEach(function(answer, index) {
        var divAnswer = document.createElement("div");
        divAnswer.id = "quizz-app-questions-" + questionId + "-answers-" + index;
        divAnswersAndSolutions.appendChild(divAnswer);
        
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
    var h = document.createElement(QUESTION_TITLE_TYPE);
    var textNode = document.createTextNode(text);
    h.appendChild(textNode);
    h.id = id;
    dom.appendChild(h);
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