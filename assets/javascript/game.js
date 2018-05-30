/*GAME VARIABLES*/
var data = ['Ada Lovelace', 'Bill Gates', 'James Gosling', 'Donald Knuth', 'Dennis Ritchie', 'Bjarne Stroustrup', 'Guido van Rossum', 'Ken Thompson',];
var wins = 0;
var losses = 0;
var play = false;

var selectedNames = [false, false, false, false, false, false, false, false];

/*SESSION VARIABLES*/
var attempsLeft = 6;
var streak = 0;
var hints = 2;

var selectedIndex = 0;
var selectedName = "";
var nameCompleted = [];


/********** RESET FOR NEW GAME **********/
function newGame() {
    if (!play) {
        play = true;

        activateControls();
        resetVars();
        updateGameStatistics();
        selectChallange();
    }
}

function resetVars() {
    attempsLeft = 6;
    streak = 0;
    hints = 2;
    play = true;
    nameCompleted = [];
}
/***************************************/

/************ GAME FUNCTIONS **********/
function selectChallange() {
    selectedIndex = noRepeatedNumbers(data.length);
    selectedName = data[selectedIndex];
    generateUnderScores();
    updateName(nameCompleted.join(''));
}

/* SELECTING THE NUMBER */
function noRepeatedNumbers(number) {
    var selected = getRandomNumber(number);

    if (wins > 0 || losses > 0) {
        while (numberWasSelected(selected)) {
            selected = getRandomNumber(number);
        }
    }

    selectedNames[selected] = true;
    return selected;
}
function numberWasSelected(selected) {
    if ((wins + losses) === selectedNames.length) {
        for (var index = 0; index < array.length; index++) {
            selectedNames[index] = false;
        }
    }
    return selectedNames[selected];
}

/* SHOWING UNDERSCORES */
function generateUnderScores() {
    for (var index = 0; index < selectedName.length; index++) {
        if (selectedName.charAt(index) === " ") {
            nameCompleted[index] = " ";
        } else {
            nameCompleted[index] = "_";
        }
    }
}

/* COMPLETE CORRECT LETTER */
function guessLetter(character) {
    for (var index = 0; index < selectedName.length; index++) {
        if (selectedName.charAt(index).toLowerCase() == character) {
            nameCompleted[index] = selectedName.charAt(index);
        }
    }
}

/* PLAY GAME */
function playGame(input) {
    if (letterIsPresent(input)) {
        guessLetter(input);

        if (selectedName == nameCompleted.join('')) {
            winGame();
            updateName(selectedName);
        } else {
            increaseStreak();
            updateName(nameCompleted.join(''));
        }
    } else {
        failedAttemp();
        resetStreak();

        if (attempsLeft == 0) {
            gameOver();
        } else {
            /* Show message if the letter was incorrect */

        }
    }
}

/* WIN THE GAME */
function winGame() {
    increaseWins();
    updateSessionStatistics();
    desactivateControls();
    winMessage();
    play = false;
}

/* GAME OVER */
function gameOver() {
    increaseLosses();
    updateSessionStatistics();
    updateName(selectedName);//Show correct answer
    desactivateControls();
    lossMessage();
    play = false;
}

/***************************************/

/********** UTILITY FUNCTIONS **********/
function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

function increaseWins() {
    wins++;
}

function increaseLosses() {
    losses++;
}

function failedAttemp() {
    attempsLeft--;
}

function hintUsed() {
    hints--;
}

function increaseStreak() {
    streak++;
}

function resetStreak() {
    streak = 0;
}

function letterIsPresent(character) {
    return (selectedName.indexOf(character) > -1 || selectedName.indexOf(character.toUpperCase()) > -1);
}

function desactivateControls() {
    var allButtons = document.querySelectorAll("button");
    for (var index = 0; index < allButtons.length; index++) {
        allButtons[index].disabled = true;
    }
    var newGame = document.getElementById("newGame");
    newGame.disabled = false;
    newGame.style.visibility = "visible";
}

function activateControls() {
    var allButtons = document.querySelectorAll("button");
    for (var index = 0; index < allButtons.length; index++) {
        allButtons[index].disabled = false;
    }
    var newGame = document.getElementById("newGame");
    newGame.disabled = true;
    newGame.style.visibility = "hidden";

    newGame = document.getElementById("presentation");
    newGame.style.visibility = "hidden";
}
/***************************************/

/* EVENTS MANIPULATION*/

window.onload = function () {

    var isFirexFox = function () {
        return navigator.userAgent.indexOf("Firefox") > 0 ? true : false;
    }

    var clickHandler = function (index) {
        //Play
        playGame(index);
        updateGameStatistics();
    }

    var btnGroup = document.getElementById("alphabet");

    btnGroup.addEventListener("click", function (event) {

        var targetId;
        if (isFirexFox()) {
            //for Firefox
            targetId = event.target.value;
            event.target.disabled = true;
        }
        else {
            //For IE, Chrome
            targetId = event.srcElement.value;
            event.srcElement.disabled = true;
        }

        clickHandler(targetId);

    });
}



function updateName(name) {
    var output = "";
    for (var index = 0; index < name.length; index++) {
        if (index === name.length) {
            output += name.charAt(index);
        }
        if (name.charAt(index) == " ") {
            output += name.charAt(index) + "&nbsp ";
        }
        output += name.charAt(index) + " ";
    }
    document.getElementById("nameGuess").innerHTML = output;
}

function updateGameStatistics() {
    document.getElementById("attLeft").innerHTML = attempsLeft;
    document.getElementById("streak").innerHTML = streak;
}

function updateSessionStatistics() {
    document.getElementById("wins").innerHTML = wins;
    document.getElementById("losses").innerHTML = losses;
}

function lossMessage() {
    document.getElementById("presentation").innerHTML = 'Game Over!';
    document.getElementById("presentation").style.visibility = "visible";
    document.getElementById("presentation").style.color = "red";
    document.getElementById("presentation").style.fontSize = "60px";
}

function winMessage() {
    document.getElementById("presentation").innerHTML = 'You won, Congratulations!';
    document.getElementById("presentation").style.visibility = "visible";
    document.getElementById("presentation").style.color = "green";
    document.getElementById("presentation").style.fontSize = "60px";
}