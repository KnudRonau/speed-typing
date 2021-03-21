
//Global variables
let variables = {
    startTime: null,
    timer: null,
    index: 0,
    errors: 0
};

//opens the XML file and returns it in a usable form
function loadDoc() {
    let xmlRequester = new XMLHttpRequest();
    xmlRequester.open("get",  "texts.xml", false);
    xmlRequester.send();
    return xmlRequester.responseXML;
}

//chooses the right text based on language
function choose(i) {
    if(document.getElementById("english").checked) {
        i = parseInt(i) + 4;
    }
    loadText(i)
}

//loads title, info and text into place
function loadText(i) {
    let xml = loadDoc();
    let titleTag = xml.getElementsByTagName("title");
    let authorTag = xml.getElementsByTagName("author");
    let textTag = xml.getElementsByTagName("text");

    //stores the desired XML-values in variables
    let title = titleTag[i].childNodes[0].nodeValue;
    let author = authorTag[i].childNodes[0].nodeValue;
    let text = textTag[i].childNodes[0].nodeValue;

    //stores word and character information in variables
    let words = text.split(" ").length;
    let chars = text.length;

    //adds the information to the webpage
    document.getElementById("textContent").innerHTML = text;
    document.getElementById("title").innerHTML = title;
    document.getElementById("textInformation").innerHTML = author + " (" + words + " words, " + chars + "chars)";
}

//responsible for changing language
function changeLanguage(language) {
    let xml = loadDoc();
    let titleTag = xml.getElementsByTagName("title");
    let i = 0;
    let j = 0;
    if(language === "english") {
        j += 4;
    }

    //loads each title and adds them as options on the webpage
    for(i; i < 4; i++, j++) {
        let title = titleTag[j].childNodes[0].nodeValue;
        document.getElementById("option" + (i + 1)).innerHTML = title;
    }

    //updates the text to match the language
    choose(document.getElementById("selectText").value);
}

//Plays sound when wrong button is clicked
function playSound() {
    let sound = new Audio("audio/failSound.mp3");
    sound.play();
}

//Draws the process of average gross WPM
function drawStat(time, wpm) {
    let ctx = document.querySelector("canvas").getContext("2d");

    //draws a continuing line, which progresses 2 pixels pr second
    ctx.strokeStyle = "#c7dff5"
    ctx.lineTo(2 * time, 100 - parseInt(wpm));
    ctx.stroke();
}

//Sets up the canvas and starts a new path to draw from
function drawCanvas() {
    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");
    //clears the canvas, so that if a new game is started, old stats will be wiped
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draws horizontal lines at 25/50/75 WPM
    let yGrid = 25;
    ctx.beginPath();
    while(yGrid<canvas.height) {
        ctx.moveTo(0, yGrid);
        ctx.lineTo(canvas.width, yGrid);
        yGrid += 25;
    }
    ctx.strokeStyle = "#dda544";
    ctx.stroke();

    //starts a new line, which starts from the lower left corner
    ctx.beginPath();
    ctx.moveTo(0, 100);
}

//compares the last character of the input box with the reached <span> element, assigns an appropriate class and
//increments the index
function keyPress() {
    //sets variables to be used in this function for at better overview.
    let text = document.getElementById("textContent").querySelectorAll("span");
    let index = variables.index;
    let nextIndex = index + 1;
    let input = document.getElementById("inputBox").value.split("");
    let textChar = text[index].innerText;
    let inputChar = input[input.length - 1];

    //if "ignore casing" is checked, both input and text character is set to lower
    if(document.getElementById("casingBox").checked) {
        textChar = textChar.toLowerCase();
        inputChar = inputChar.toLowerCase();
    }

    //adds the appropriate class and removes "current" from the <span> element and possibly increments the error counter
    if(textChar === inputChar) {
        text[index].classList.add("correct");
    } else {
        playSound();
        if(textChar === " ") {
            text[index].classList.add("incorrectSpace");
        } else {
            text[index].classList.add("incorrect");
        }
        variables.errors += 1;
    }
    text[index].classList.remove("current");

    //clears the input box when a "space" is clicked
    if(inputChar === " ") {
        document.getElementById("inputBox").value = "";
    }

    //ends the game at the end or sets the next element as current and increments the index
    if(nextIndex === text.length) {
        speedTyping();
    } else {
        text[nextIndex].classList.add("current");
        variables.index = nextIndex;
    }
}

//Turns the current text into <span> elements
function renderText() {
    let text = document.getElementById("textContent").innerHTML;

    //empties the area of the text content
    document.getElementById("textContent").innerHTML = "";

    //creates an array with each character, creates a <span> element equal to each character in the array, and adds
    //all the <span> elements to the area of text content
    text.split('').forEach(character => {
        let characterSpan = document.createElement('span')
        characterSpan.innerText = character;
        document.getElementById("textContent").appendChild(characterSpan);
    })

    //sets the first <span> element to current
    document.getElementById("textContent").querySelector("span").classList.add("current");
}

//Adds updated stats to the page and calls the function to draw canvas stats.
function statistics() {

    //loads the stored values
    let errors = variables.errors;
    let entries = variables.index;
    let startTime = variables.startTime;

    //calculates the statistics
    let accuracy = Math.round((1- errors/entries) * 100);
    let d = new Date();
    let currentTime = d.getTime();
    let elapsedTime = (currentTime - startTime)/1000;
    let elapsedTimeMinutes = elapsedTime / 60;
    let grossWPM = Math.round((entries / 5) / elapsedTimeMinutes);
    let netWPM = Math.round(grossWPM - (errors/elapsedTimeMinutes));

    //calls the drawStat function to update the canvas with the new stats
    drawStat(elapsedTime, grossWPM);

    //sets the new values in the statistics area
    document.getElementById("grossWPM").innerHTML = grossWPM;
    document.getElementById("accuracy").innerHTML = accuracy;
    document.getElementById("netWPM").innerHTML = netWPM;
    document.getElementById("errors").innerHTML = errors;
}

//Sets the global values, which need to be stored between function calls.
function setStartValues() {
    //startTime is needed to continuously monitor how long the game has been running
    let d1 = new Date();
    let startTime = d1.getTime();
    //setInterval is stored globally, so that it can be cleared later
    let timer = setInterval(statistics, 1000);

    document.getElementById("inputBox").value = "";

    //index is stored globally in order to progress to the next element with each function from input, and errors for
    //statistical purposes
    variables.startTime = startTime;
    variables.timer = timer;
    variables.index = 0;
    variables.errors = 0;

}

//If no game is running, this function calls all functions necessary to prepare a game and switches the image.
// Otherwise it clears the timer, so that no further statistics is updated and switches the image back.
function speedTyping() {
    let img = document.getElementById("startStopBtn");
    let selectText = document.getElementById("selectText");

    if(img.getAttribute("src") === "img/StartButton.png") {
        //renews the text, if the game has already been played
        choose(selectText.value);
        //renders the text to <span> elements
        renderText();
        //stores starting time, starts interval for statistics and resets index and errors to 0 in case the game has
        //been played before
        setStartValues();
        //sets up the canvas
        drawCanvas();

        img.setAttribute("src", "img/StopButton.png");
        document.getElementById("inputBox").focus();

    } else if(img.getAttribute("src") === "img/StopButton.png") {
        //stops the interval
        let timer = variables.timer;
        clearInterval(timer);

        img.setAttribute("src", "img/StartButton.png");
    }
}

//adds listeners
function addListeners() {

    //adds listeners to language radio
    let radios = document.querySelectorAll('input[name="language"]');
    radios.forEach(radio => radio.addEventListener("change", function () {
        changeLanguage(radio.value); }, false));

    //adds listener to textSelector
    document.getElementById("selectText").addEventListener("change", function () {
             choose(this.value);}, false);

    //adds listener to the start button
    document.getElementById("startStopBtn").addEventListener("click", function () {
        speedTyping();}, false);

    //adds listener to the input box
    document.getElementById("inputBox").addEventListener(("input"), function () {
        keyPress();}, false);
}

//runs when the page has been loaded an calls the proper functions
function start() {
    //loads an initial text
    choose(0);
    //loads text options
    changeLanguage("swedish");
    //adds eventListeners to the page
    addListeners();
    //sets the lines in the canvas, so that they are there from when the page is opened
    drawCanvas();
}

//calls the starting function on load
window.addEventListener("load", start, false);

