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

    var quizzName = jsonObject.name;
    var h = document.createElement(MAIN_TITLE_TYPE);
    var textName = document.createTextNode(quizzName);
    h.appendChild(textName);
    h.id = "quizz-app-name";
    dom.appendChild(h);

    var quizzDescription = jsonObject.description;
    var textDesc = document.createTextNode(quizzDescription);
    textDesc.id = "quizz-app-description";
    dom.appendChild(textDesc);

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
    var questionName = question.name;
    var h = document.createElement(QUESTION_TITLE_TYPE);
    var textName = document.createTextNode(questionName);
    h.appendChild(textName);
    h.id = "quizz-app-questions-" + questionId + "-name";
    dom.appendChild(h);

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


        var textanswer = document.createTextNode(answer);
        textanswer.id = "quizz-app-questions-" + questionId + "-answers-" + index + "-text";
        divAnswer.appendChild(textanswer);
    });
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