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
        ELEMENT_CHECKBOX: "checkbox",
        ELEMENT_HR: "hr"
    },
    ids: {
        ID_MAIN_DIV: "quizz-app",
        ID_MAIN_TITLE: "{0}-{1}-name",
        ID_MAIN_DESCRIPTION: "{0}-{1}-description",
        ID_MAIN_QUESTIONS: "{0}-{1}-questions",
        ID_MAIN_VALIDATE: "{0}-{1}-validate",
        ID_MAIN_SCORE: "{0}-{1}-score",
        questions: {
            ID_QUESTION_MAIN: "{0}-{1}-questions-{2}-main",
            ID_QUESTION_NAME: "{0}-{1}-questions-{2}-name",
            ID_QUESTION_ANSWERS: "{0}-{1}-questions-{2}-answers",
            ID_QUESTION_ANSWER: "{0}-{1}-questions-{2}-answers-{3}",
            ID_QUESTION_CHECKBOX: "{0}-{1}-questions-{2}-answers-{3}-checkbox",
            ID_QUESTION_TEXT: "{0}-{1}-questions-{2}-answers-{3}-text",
            ID_QUESTION_INPUT: "{0}-{1}-questions-{2}-input",
            ID_QUESTION_ANSWERS_SOLUTIONS: "{0}-{1}-questions-{2}-answersAndSolutions",
            ID_QUESTION_SOLUTIONS: "{0}-{1}-questions-{2}-solutions",
            ID_QUESTION_HINTS: "{0}-{1}-questions-{2}-hints",
            ID_QUESTION_HINTS_BUTTON: "{0}-{1}-questions-{2}-hints-button-{3}",
            ID_QUESTION_HINTS_TEXT: "{0}-{1}-questions-{2}-hints-text-{3}"
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
            LIST_SOLUTIONS: "list_solutions",
            BTN_HINT: "button_hint",
            BTN_VALIDATE: "button_validate"
    }
};

var loader = setInterval(function() {
    if (document.readyState !== "complete") return;
    clearInterval(loader);
    json.forEach(function(quizz, index) {
        createNewQuizz(quizz, index);
    });
}, 300);

function createNewQuizz(quizz, quizzId) {
    if (quizz.display_hints != config.DISPLAY_HINTS)
        config.DISPLAY_HINTS = quizz.display_hints;

    if (quizz.element_id != config.ids.ID_MAIN_DIV)
        config.ids.ID_MAIN_DIV = quizz.element_id;

    var dom = document.getElementById(config.ids.ID_MAIN_DIV);
    console.log(dom);

    displayTitleNode(quizz.name, config.MAIN_TITLE_TYPE, config.ids.ID_MAIN_TITLE, dom);

    displayTextNode(quizz.description, config.ids.ID_MAIN_DESCRIPTION, dom);

    var quizzQuestions = quizz.questions;
    var divQuestions = createDivNode(config.ids.ID_MAIN_QUESTIONS, config.class.DIV_QUESTIONS, dom);

    quizzQuestions.forEach(function(question, index) {
        if (question.type == config.types.QUESTION_QCM)
            createNewQCM(question, divQuestions, index, quizzId);
        else if (question.type == config.types.QUESTION_OPEN)
            createNewOpen(question, divQuestions, index, quizzId);
        else if (question.type == config.types.QUESTION_LINKED)
            createNewLinked(question, divQuestions, index, quizzId);
    });

    createButton(config.lang.button.validate, config.ids.ID_MAIN_VALIDATE, config.class.BTN_VALIDATE, dom, function() { validateQuizz(quizzQuestions, dom, quizzId); });
}

function createNewQCM(question, dom, questionId, quizzId) {
    var divQuestion = createDivNode(config.ids.questions.ID_QUESTION_MAIN.format(config.ids.ID_MAIN_DIV, quizzId, questionId), config.class.DIV_QUESTION, dom);

    displayTitleNode(question.name, config.QUESTION_TITLE_TYPE, config.ids.questions.ID_QUESTION_NAME.format(config.ids.ID_MAIN_DIV, quizzId, questionId), divQuestion);

    var questionAnswers = question.answers;
    var divAnswers = createDivNode(config.ids.questions.ID_QUESTION_ANSWERS.format(config.ids.ID_MAIN_DIV, quizzId, questionId), config.class.DIV_ANSWERS, divQuestion);

    questionAnswers.forEach(function(answer, index) {
        var divAnswer = createDivNode(config.ids.questions.ID_QUESTION_ANSWER.format(config.ids.ID_MAIN_DIV, quizzId, questionId, index), config.class.DIV_ANSWER, divAnswers);

        var checkboxAnswer = document.createElement(config.elements.ELEMENT_INPUT);
        checkboxAnswer.type = config.elements.ELEMENT_CHECKBOX;
        checkboxAnswer.id = config.ids.questions.ID_QUESTION_CHECKBOX.format(config.ids.ID_MAIN_DIV, quizzId, questionId, index);
        divAnswer.appendChild(checkboxAnswer);

        displayTextNode(answer, config.ids.questions.ID_QUESTION_TEXT.format(config.ids.ID_MAIN_DIV, quizzId, questionId, index), divAnswer);
    });

    if (config.DISPLAY_HINTS)
        displayHints(question.hints, questionId, divQuestion);

    dom.appendChild(document.createElement("hr"));
}

function createNewOpen(question, dom, questionId, quizzId) {
    var divQuestion = createDivNode(config.ids.questions.ID_QUESTION_MAIN.format(config.ids.ID_MAIN_DIV, quizzId, questionId), config.class.DIV_QUESTION, dom);

    displayTitleNode(question.name, config.QUESTION_TITLE_TYPE, config.ids.questions.ID_QUESTION_NAME.format(config.ids.ID_MAIN_DIV, quizzId, questionId), divQuestion);

    var inputSolution = document.createElement(config.elements.ELEMENT_INPUT);
    inputSolution.type = "text";
    inputSolution.required = true;
    inputSolution.id = config.ids.questions.ID_QUESTION_INPUT.format(config.ids.ID_MAIN_DIV, quizzId, questionId);
    divQuestion.appendChild(inputSolution);

    if (config.DISPLAY_HINTS)
        displayHints(question.hints, questionId, divQuestion);

    dom.appendChild(document.createElement(config.elements.ELEMENT_HR));
}

function createNewLinked(question, dom, questionId, quizzId) {
    var divQuestion = createDivNode(config.ids.questions.ID_QUESTION_MAIN.format(config.ids.ID_MAIN_DIV, quizzId, questionId), config.class.DIV_QUESTION, dom);

    displayTitleNode(question.name, config.QUESTION_TITLE_TYPE, config.ids.questions.ID_QUESTION_NAME.format(config.ids.ID_MAIN_DIV, quizzId, questionId), divQuestion); 

    var questionAnswers = question.answers;
    var questionSolutions = [...question.solution];
    questionSolutions = shuffle(questionSolutions);
    var divAnswersAndSolutions = createDivNode(config.ids.questions.ID_QUESTION_ANSWERS_SOLUTIONS.format(config.ids.ID_MAIN_DIV, quizzId, questionId), config.class.DIV_SOLUTIONS, divQuestion);

    createUlNode(config.ids.questions.ID_QUESTION_ANSWERS.format(config.ids.ID_MAIN_DIV, quizzId, questionId), divAnswersAndSolutions, config.class.LIST_ANSWERS, questionAnswers);

    var ulSolutions = createUlNode(config.ids.questions.ID_QUESTION_SOLUTIONS.format(config.ids.ID_MAIN_DIV, quizzId, questionId), divAnswersAndSolutions, config.class.LIST_SOLUTIONS, questionSolutions);

    new Sorter(ulSolutions);

    if (config.DISPLAY_HINTS)
        displayHints(question.hints, questionId, divQuestion);

    dom.appendChild(document.createElement(config.elements.ELEMENT_HR));
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

function displayHints(hints, questionId, dom, quizzId) {
    if (hints.length <= 0 || hints.isEmpty()) return;

    var divHints = createDivNode(config.ids.questions.ID_QUESTION_HINTS.format(config.ids.ID_MAIN_DIV, quizzId, questionId), config.class.DIV_HINTS, dom);

    hints.forEach(function(hint, index) {
        if (hint == "") return;
        createButton(config.lang.button.displayHint.format(index + 1), config.ids.questions.ID_QUESTION_HINTS_BUTTON.format(config.ids.ID_MAIN_DIV, quizzId, questionId, index), config.class.BTN_HINT, divHints, function() {
            var button = document.getElementById(config.ids.questions.ID_QUESTION_HINTS_BUTTON.format(config.ids.ID_MAIN_DIV, quizzId, questionId, index));
            displayTitleNode(hints[index], config.NORMAL_TEXT_TYPE, config.ids.questions.ID_QUESTION_HINTS_TEXT.format(config.ids.ID_MAIN_DIV, quizzId, questionId, index), divHints);
            button.remove();
        });
    });

}

function createButton(text, id, classe, dom, onclick) {
    var button = document.createElement(config.elements.ELEMENT_BUTTON);
    button.innerHTML = text;
    button.id = id;
    button.className = classe;
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

function validateQuizz(questions, dom, quizzId) {
    var rightQuestions = 0;
    questions.forEach(function(question, index) {
        if (question.type == config.types.QUESTION_QCM) {
            if (validateQCM(question, index, quizzId))
                rightQuestions++;
        } else if (question.type == config.types.QUESTION_OPEN) {
            if (validateOpen(question, index, quizzId))
                rightQuestions++;
        } else if (question.type == config.types.QUESTION_LINKED) {
            if (validateLinked(question, index, quizzId))
                rightQuestions++;
        }
    });
    console.log(rightQuestions);

    if(typeof(document.getElementById(config.ids.ID_MAIN_SCORE)) != 'undefined' && document.getElementById(config.ids.ID_MAIN_SCORE) != null)
        document.getElementById(config.ids.ID_MAIN_SCORE).remove();
    displayTitleNode(`Votre score est de ${rightQuestions}/${questions.length} !`, config.SCORE_TITLE_TYPE, config.ids.ID_MAIN_SCORE, dom);
}

function validateQCM(question, questionId, quizzId) {
    var solution = question.solution;
    var answers = question.answers;
    var rightAnswers = 0;
    answers.forEach(function(answer, index) {
        if (document.getElementById(config.ids.questions.ID_QUESTION_CHECKBOX.format(config.ids.ID_MAIN_DIV, quizzId, questionId, index)).checked) {
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

function validateOpen(question, questionId, quizzId) {
    var solution = question.solution;
    var elem = document.getElementById(config.ids.questions.ID_QUESTION_INPUT.format(config.ids.ID_MAIN_DIV, quizzId, questionId));
    if (question.caseSensitive) {
        if (elem.value == solution)
            return true;
    } else {
        if (elem.value.toLowerCase() == solution.toLowerCase())
            return true;
    }
    return false;
}

function validateLinked(question, questionId, quizzId) {
    var ulSolutions = document.getElementById(config.ids.questions.ID_QUESTION_SOLUTIONS.format(config.ids.ID_MAIN_DIV, quizzId, questionId));

    var userInput = [];
    for (i = 0; i < ulSolutions.children.length; i++) {
        var child = ulSolutions.children[i];
        userInput.push(child.textContent);
    }
    return compare(question.solution, userInput);
}

Array.prototype.isEmpty = function() {
    var arrSize = this.length, emptyItems = 0
    this.forEach(function(item) {
        if(item == "") 
        emptyItems++;
    });
    return arrSize == emptyItems;
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
