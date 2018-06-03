/*GAME VARIABLES*/
var data = ['Ada Lovelace', 'Bill Gates', 'James Gosling',
    'Donald Knuth', 'Dennis Ritchie', 'Bjarne Stroustrup',
    'Linus Torvalds', 'Ken Thompson',];
var pic = ['assets/images/Persons/ada.jpg', 'assets/images/Persons/bill.jpg',
    'assets/images/Persons/James.jpg', 'assets/images/Persons/Donald.jpg', 'assets/images/Persons/Dennis.jpg',
    'assets/images/Persons/Bjarne.jpg', 'assets/images/Persons/linus-torvalds.jpg', 'assets/images/Persons/Ken.jpg'];
var hintsArray = [['English mathematician and writer.', 'first to recognise the full potential of a "computing machine."',
    'A  computer language was named after him/her', 'Son/daughter of a famous poet.'],
['Principal founder of one of the biggest software company.', 'One of the best-known entrepreneurs of the personal computer revolution.',
    'He/She enrolled at Harvard College in the autumn of 1973.', 'Identified innovation as the "real driver of progress".'],
['Invented the Java programming language in 1994.', 'Received a Bachelor of Science from the University of Calgary.',
    'He built a multi-processor version of Unix for a 16-way computer system.', 'Has worked for Oracle, Google and Amazon.'],
['Author of " The Art of Computer Programming".', 'In 1971, Knuth was the recipient of the first ACM Grace Murray Hopper Award.',
    'In 1974 received the Turing Award.', 'Created the WEB and CWEB computer programming systems.'],
['Created the C programming language.', 'Created the Unix operating system with Ken Thompson.',
    'Received the National Medal of Technology from President Bill Clinton in 1999.', 'Received the Turing Award from the ACM in 1983.'],
['Was the head of AT&T Bell Labs "Large-scale Programming Research department".', 'Author of the book " The C++ Programming Language".',
    'Winner of 2018 Computer Pioneer Award of the IEEE Computer Society.', 'Danish computer scientist.'],
['Principal developer of the Linux kernel', 'Creator of the distributed revision control system Git.',
    'Winner of 2014 IEEE Computer Society Computer Pioneer Award.', 'Attended the University of Helsinki between 1988 and 1996.'],
['Invented the B programming language.', 'Invented the Go programming language.',
    'Designed and implemented the original Unix operating system.', 'In 1983 received the Turing Award.']
];
var wins = 0;
var losses = 0;
var play = false;

var selectedNames = [false, false, false, false, false, false, false, false];
var selectedHint = [false, false, false, false];

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
        setImage(attempsLeft);
        resetHints();
    }
}

function resetVars() {
    attempsLeft = 6;
    streak = 0;
    hints = 2;
    play = true;
    nameCompleted = [];
}

function resetHints(){
    hints = 2;
    updateHints();
    var element = document.getElementById('hintsList');

    element.removeChild(element.childNodes[0]);
    element.removeChild(element.childNodes[0]);
}
/***************************************/

/************ GAME FUNCTIONS **********/
function selectChallange() {
    selectedIndex = noRepeatedNumbers(data.length);
    selectedName = data[selectedIndex];
    generateUnderScores();
    updateName(nameCompleted.join(''));
}

function setImage(value) {
    document.getElementById('picture').setAttribute("src", pic[selectedIndex]);
    document.getElementById('picture').style.filter = "blur(" + value * 5 + "px)";
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

/* GIVE A HINT */
function giveHint() {
    if (stillHints()) {
        var hintIndex = randomNoRepeatedHint();
        showHint(hintIndex);
        hintUsed();
        updateHints();

        if(!stillHints()){
            desactivateHints();  
        }
    }
}

function updateHints(){
    document.getElementById("badgeCount").textContent = hints;
}

function showHint(hintIndex) {
    var para = document.createElement("li");
    var node = document.createTextNode(hintsArray[selectedIndex][hintIndex]);
    para.appendChild(node);

    para.classList.add("list-group-item");

    var element = document.getElementById('hintsList');
    element.appendChild(para);
}

function desactivateHints(){
    var newGame = document.getElementById("hintsButton");
    newGame.disabled = true;
}

function randomNoRepeatedHint() {
    var selected = getRandomNumber(4);
    while (selectedHint[selected]) {
        selected = getRandomNumber(4);
    }
    selectedHint[selected] = true;
    return selected;
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
        setImage(attempsLeft);

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
    setImage(0);
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

function stillHints() {
    return hints !== 0;
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