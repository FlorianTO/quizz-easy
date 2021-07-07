var config = {
    JSON_FILE: './test-files/test1.js',
    DISPLAY_HINTS: true, //true : hints are displayed //false : hints aren't displayed
    MAIN_TITLE_TYPE: "h2", //h1 to h6
    QUESTION_TITLE_TYPE: "h3", //h1 to h6
    SCORE_TITLE_TYPE: "h4", //h1 to h6
    NORMAL_TEXT_TYPE: "p",
    lang: {
        button: {
            validate: "Valider les réponses du quizz",
            displayHint: "Afficher l'indice {0}"
        }
    },
    types: {
        QUESTION_QCM: "QCM",
        QUESTION_OPEN: "OPEN",
        QUESTION_LINKED: "LINKED"
    },
    elements: {
        ELEMENT_BUTTON: "button",
        ELEMENT_INPUT: "input",
        ELEMENT_CHECKBOX: "checkbox"
    },
    ids: {
        ID_MAIN_DIV: "quizz-app",
        ID_MAIN_TITLE: "quizz-app-name",
        ID_MAIN_DESCRIPTION: "quizz-app-description",
        ID_MAIN_QUESTIONS: "quizz-app-questions",
        ID_MAIN_VALIDATE: "quizz-app-validate",
        ID_MAIN_SCORE: "quizz-app-score",
        questions: {
            ID_QUESTION_MAIN: "quizz-app-questions-{0}-main",
            ID_QUESTION_NAME: "quizz-app-questions-{0}-name",
            ID_QUESTION_ANSWERS: "quizz-app-questions-{0}-answers",
            ID_QUESTION_ANSWER: "quizz-app-questions-{0}-answers-{1}",
            ID_QUESTION_CHECKBOX: "quizz-app-questions-{0}-answers-{1}-checkbox",
            ID_QUESTION_TEXT: "quizz-app-questions-{0}-answers-{1}-text",
            ID_QUESTION_INPUT: "quizz-app-questions-{0}-input"

        }
    },
    class: {
        DIV_QUESTIONS: "questions",
            DIV_QUESTION: "question",
            DIV_ANSWERS: "answers",
            DIV_ANSWER: "answer",
            DIV_SOLUTIONS: "solutions",
            DIV_HINTS: "hints",
            LIST_ANSWERS: "list_answers",
            LIST_SOLUTIONS: "list_solutions"
    }
};

var loader = setInterval(function() {
    if (document.readyState !== "complete") return;
    clearInterval(loader);
    createNewQuizz(json);
}, 300);

function createNewQuizz(jsonObject) {
    if (jsonObject.display_hints != config.DISPLAY_HINTS)
        config.DISPLAY_HINTS = jsonObject.display_hints;

    var dom = document.getElementById(config.ids.ID_MAIN_DIV);
    console.log(dom);

    displayTitleNode(jsonObject.name, config.MAIN_TITLE_TYPE, config.ids.ID_MAIN_TITLE, dom);

    displayTextNode(jsonObject.description, config.ids.ID_MAIN_DESCRIPTION, dom);

    var quizzQuestions = jsonObject.questions;
    var divQuestions = createDivNode(config.ids.ID_MAIN_QUESTIONS, config.class.DIV_QUESTIONS, dom);

    quizzQuestions.forEach(function(question, index) {
        if (question.type == config.types.QUESTION_QCM)
            createNewQCM(question, divQuestions, index);
        else if (question.type == config.types.QUESTION_OPEN)
            createNewOpen(question, divQuestions, index);
        else if (question.type == config.types.QUESTION_LINKED)
            createNewLinked(question, divQuestions, index);
    });

    createButton(config.lang.button.validate, config.ids.ID_MAIN_VALIDATE, dom, function() { validateQuizz(quizzQuestions, dom); });
}

function createNewQCM(question, dom, questionId) {
    var divQuestion = createDivNode(config.ids.questions.ID_QUESTION_MAIN.format(questionId), config.class.DIV_QUESTION, dom);

    displayTitleNode(question.name, config.QUESTION_TITLE_TYPE, config.ids.questions.ID_QUESTION_NAME.format(questionId), divQuestion);

    var questionAnswers = question.answers;
    var divAnswers = createDivNode(config.ids.questions.ID_QUESTION_ANSWERS.format(questionId), config.class.DIV_ANSWERS, divQuestion);

    questionAnswers.forEach(function(answer, index) {
        var divAnswer = createDivNode(config.ids.questions.ID_QUESTION_ANSWER.format(questionId, index), config.class.DIV_ANSWER, divAnswers);

        var checkboxAnswer = document.createElement(config.elements.ELEMENT_INPUT);
        checkboxAnswer.type = config.elements.ELEMENT_CHECKBOX;
        checkboxAnswer.id = config.ids.questions.ID_QUESTION_CHECKBOX.format(questionId, index);
        divAnswer.appendChild(checkboxAnswer);

        displayTextNode(answer, config.ids.questions.ID_QUESTION_TEXT.format(questionId, index), divAnswer);
    });

    if (config.DISPLAY_HINTS)
        displayHints(question.hints, questionId, divQuestion);

    dom.appendChild(document.createElement("hr"));
}

function createNewOpen(question, dom, questionId) {
    var divQuestion = createDivNode(config.ids.questions.ID_QUESTION_MAIN.format(questionId), config.class.DIV_QUESTION, dom);

    displayTitleNode(question.name, config.QUESTION_TITLE_TYPE, config.ids.questions.ID_QUESTION_NAME.format(questionId), divQuestion);

    var inputSolution = document.createElement(config.elements.ELEMENT_INPUT);
    inputSolution.type = "text";
    inputSolution.required = true;
    inputSolution.id = config.ids.questions.ID_QUESTION_INPUT.format(questionId);
    divQuestion.appendChild(inputSolution);

    if (config.DISPLAY_HINTS)
        displayHints(question.hints, questionId, divQuestion);

    dom.appendChild(document.createElement("hr"));
}

function createNewLinked(question, dom, questionId) {
    var divQuestion = createDivNode(config.ids.questions.ID_QUESTION_MAIN.format(questionId), config.class.DIV_QUESTION, dom);

    displayTitleNode(question.name, config.QUESTION_TITLE_TYPE, config.ids.questions.ID_QUESTION_NAME.format(questionId), divQuestion); 

    var questionAnswers = question.answers;
    var questionSolutions = [...question.solution];
    questionSolutions = shuffle(questionSolutions);
    var divAnswersAndSolutions = createDivNode("quizz-app-questions-" + questionId + "-answersAndSolutions", config.class.DIV_SOLUTIONS, divQuestion);

    createUlNode("quizz-app-questions-" + questionId + "-answers", divAnswersAndSolutions, config.class.LIST_ANSWERS, questionAnswers);

    var ulSolutions = createUlNode("quizz-app-questions-" + questionId + "-solutions", divAnswersAndSolutions, config.class.LIST_SOLUTIONS, questionSolutions);

    new Sorter(ulSolutions);

    if (config.DISPLAY_HINTS)
        displayHints(question.hints, questionId, divQuestion);

    dom.appendChild(document.createElement("hr"));
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
    if (hints.length <= 0) return;

    var divHints = createDivNode("quizz-app-questions-" + questionId + "hints", config.class.DIV_HINTS, dom);

    hints.forEach(function(hint, index) {
        if (hint == "") return;
        createButton(config.lang.button.displayHint.format(index + 1), "quizz-app-questions-" + questionId + "hints-button-" + index, divHints, function() {
            var button = document.getElementById("quizz-app-questions-" + questionId + "hints-button-" + index);
            displayTitleNode(hints[index], config.NORMAL_TEXT_TYPE, "quizz-app-questions-" + questionId + "hints-" + index, divHints);
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

function createDivNode(id, classe, dom) {
    var divNode = document.createElement("div");
    divNode.id = id;
    divNode.className = classe;
    dom.appendChild(divNode);
    return divNode;
}

function createUlNode(id, dom, classe, liElements) {
    var ul = document.createElement('ul');
    ul.id = id;
    ul.className = classe;
    dom.appendChild(ul);

    liElements.forEach(function(content, index) {
        var li = document.createElement('li');
        li.innerHTML += content;
        li.id = id + "-" + index;
        ul.appendChild(li);
    });
    return ul;
}

function shuffle(array) {
    var currentIndex = array.length,
        randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        var current = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = current;
    }
    return array;
}

function allowDrop(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drag(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function validateQuizz(questions, dom) {
    var rightQuestions = 0;
    questions.forEach(function(question, index) {
        if (question.type == config.types.QUESTION_QCM) {
            if (validateQCM(question, index))
                rightQuestions++;
        } else if (question.type == config.types.QUESTION_OPEN) {
            if (validateOpen(question, index))
                rightQuestions++;
        } else if (question.type == config.types.QUESTION_LINKED) {
            if (validateLinked(question, index))
                rightQuestions++;
        }
    });
    console.log(rightQuestions);

    displayTitleNode(`Votre score est de ${rightQuestions}/${questions.length} !`, config.SCORE_TITLE_TYPE, config.ids.ID_MAIN_SCORE, dom);
}

function validateQCM(question, questionId) {
    var solution = question.solution;
    var answers = question.answers;
    var rightAnswers = 0;
    answers.forEach(function(answer, index) {
        if (document.getElementById(config.ids.questions.ID_QUESTION_CHECKBOX.format(questionId, index)).checked) {
            if (solution.includes(index + 1)) {
                rightAnswers++;
            }
            else {
                rightAnswers = -1;
                return false;
            }
        }
    });
    return rightAnswers == solution.length;
}

function validateOpen(question, questionId) {
    var solution = question.solution;
    var elem = document.getElementById(config.ids.questions.ID_QUESTION_INPUT.format(questionId));
    if (question.caseSensitive) {
        if (elem.value == solution)
            return true;
    } else {
        if (elem.value.toLowerCase() == solution.toLowerCase())
            return true;
    }
    return false;
}

function validateLinked(question, questionId) {
    var ulSolutions = document.getElementById("quizz-app-questions-" + questionId + "-solutions");

    var userInput = [];
    for (i = 0; i < ulSolutions.children.length; i++) {
        var child = ulSolutions.children[i];
        userInput.push(child.textContent);
    }
    return compare(question.solution, userInput);
}

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

/**
 * @author FlorianTO
 * Compare two arrays of the same size
 * Comparison isn't type sensitive
 * 
 * @param {Array} arr1 an array
 * @param {Array} arr2 another array
 * @returns true if arrays have similar content false if arrays are not the same
 */
function compare(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length)
        return false;

    var _arr1 = arr1.concat();
    var _arr2 = arr2.concat();

    for (i = 0; i < _arr1.length; i++)
        if (_arr1[i] != _arr2[i])
            return false;
    return true;
}

/**
 * @author alsolovyev
 * @license MIT
 * https://www.cssscript.com/draggable-list-sorter/
 */
var Sorter = (function() {
    "use strict";

    function e() {
        return (e =
            Object.assign ||
            function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
                }
                return e;
            }).apply(this, arguments);
    }
    return (function() {
        function t(e) {
            if (!(e instanceof Element)) throw TypeError("Sorter: 'container' must be an HTMLElement, not " + {}.toString.call(e));
            (this._container = e), (this._children = Array.from(this._container.children)), (this._isDragging = !1), (this._draggedItem = null), (this._draggedIndex = null), this._bind(), this._addListeners();
        }
        var n = t.prototype;
        return (
            (n._findChild = function(e) {
                for (; e.parentNode !== this._container;) e = e.parentNode;
                return e;
            }),
            (n._insertChild = function(e) {
                var t = this._findIndex(e);
                this._draggedIndex !== t &&
                    (this._container.insertBefore(this._draggedItem, this._draggedIndex < t ? e.nextSibling : e), this._children.splice(this._draggedIndex, 1), this._children.splice(t, 0, this._draggedItem), (this._draggedIndex = t));
            }),
            (n._findIndex = function(e) {
                var t = this._children.indexOf(e);
                if (t < 0) throw new Error("Element is not a child of the container");
                return t;
            }),
            (n._toggleElementStyles = function(t, n) {
                if (t.hasAttribute("style")) return t.removeAttribute("style");
                if ("object" != typeof n) throw new Error("The 'styles' expects a mapping from style properties to values");
                e(t.style, n);
            }),
            (n._onMouseDown = function(e) {
                e.target !== this._container &&
                    (e.preventDefault(),
                        (this._isDragging = !0),
                        (this._draggedItem = this._findChild(e.target)),
                        (this._draggedIndex = this._findIndex(this._draggedItem)),
                        this._toggleElementStyles(this._draggedItem, { opacity: "0.75" }),
                        this._toggleElementStyles(this._container, { cursor: "move" }));
            }),
            (n._onMouseOver = function(e) {
                var t = e.target;
                this._isDragging && t !== this._container && this._insertChild(this._findChild(t));
            }),
            (n._onMouseUp = function() {
                this._isDragging && (this._toggleElementStyles(this._draggedItem), this._toggleElementStyles(this._container), (this._isDragging = !1), (this._draggedItem = null), (this._draggedIndex = null));
            }),
            (n._addListeners = function() {
                this._container.addEventListener("mousedown", this._onMouseDown), this._container.addEventListener("mouseover", this._onMouseOver), document.addEventListener("mouseup", this._onMouseUp);
            }),
            (n._bind = function() {
                (this._onMouseDown = this._onMouseDown.bind(this)), (this._onMouseOver = this._onMouseOver.bind(this)), (this._onMouseUp = this._onMouseUp.bind(this));
            }),
            (n.destroy = function() {
                this._container.removeEventListener("mousedown", this._onMouseDown), this._container.removeEventListener("mouseover", this._onMouseOver), document.removeEventListener("mouseup", this._onMouseUp);
            }),
            t
        );
    })();
})();
