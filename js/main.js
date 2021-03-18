
//opens the XML file
function loadDoc() {

    var xmlRequester = new XMLHttpRequest();
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

    let title = titleTag[i].childNodes[0].nodeValue;
    let author = authorTag[i].childNodes[0].nodeValue;
    let text = textTag[i].childNodes[0].nodeValue;
    let words = text.split(" ").length;
    let chars = text.length;

    document.getElementById("textContent").innerHTML = text;
    document.getElementById("title").innerHTML = title;
    document.getElementById("textInformation").innerHTML = author + " (" + words + " words, " + chars + "chars)";
}

//responsible for changing language
function changeLanguage(language) {
    let xml = loadDoc();
    let i = 0;
    let j = 0;
    if(language === "english") {
        j = j + 4;
    }

    for(i; i < 4; i++, j++) {
        let titleTag = xml.getElementsByTagName("title");
        let title = titleTag[j].childNodes[0].nodeValue;
        document.getElementById("option" + (i + 1)).innerHTML = title;
    }
    choose(document.getElementById("selectText").value);
}

function playSound() {
    let sound = new Audio("audio/failSound.mp3");
    sound.play();
}

function dup1() {
    let text = document.getElementById("textContent").querySelectorAll("span");
    let index = window.sessionStorage.getItem("index");
    let nextIndex = parseInt(index) + 1;
    let input = document.getElementById("inputBox").value.split("");
    let errors = parseInt(window.sessionStorage.getItem("errors"));
    let textChar = text[index].innerText;
    let inputChar = input[input.length - 1];
    if(document.getElementById("casingBox").checked) {
        textChar = textChar.toLowerCase();
        inputChar = inputChar.toLowerCase();
    }

    if(textChar === inputChar) {
        text[index].classList.add("correct");
    } else {
        playSound();
        if(textChar === " ") {
            text[index].classList.add("incorrectSpace");
        } else {
            text[index].classList.add("incorrect");
        }
        window.sessionStorage.setItem("errors", errors + 1);
    }

    text[index].classList.remove("current");
    if(inputChar === " ") {
        document.getElementById("inputBox").value = "";
    }

    if(nextIndex === text.length) {
        speedTyping();
    } else {
        text[nextIndex].classList.add("current");
        window.sessionStorage.setItem("index", nextIndex);
    }

}

function renderText() {
    let text = document.getElementById("textContent").innerHTML;
    document.getElementById("textContent").innerHTML = "";
    text.split('').forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character;
        document.getElementById("textContent").appendChild(characterSpan);

    })

    document.getElementById("textContent").querySelector("span").classList.add("current");

}

function statistics() {
    let grossWPMElement = document.getElementById("grossWPM");
    let accuracyElement = document.getElementById("accuracy");
    let netWPMElement = document.getElementById("netWPM");
    let errorsElement = document.getElementById("errors");

    let errors = window.sessionStorage.getItem("errors");
    let entries = window.sessionStorage.getItem("index");
    let startTime = window.sessionStorage.getItem("startTime");

    let accuracy = (1-parseInt(errors)/parseInt(entries))*100;
    let d = new Date();
    let currentTime = d.getTime();
    let elapsedTime = (currentTime - startTime)/(60 * 1000);
    let grossWPM = (entries / 5) / elapsedTime;
    let netWPM = grossWPM - (errors/elapsedTime);

    grossWPMElement.innerHTML = Math.round(grossWPM);
    accuracyElement.innerHTML = Math.round(accuracy);
    netWPMElement.innerHTML = Math.round(netWPM);
    errorsElement.innerHTML = errors;

}

function speedTyping() {
    let img = document.getElementById("startStopBtn");
    let inputBox = document.getElementById("inputBox");
    let selectText = document.getElementById("selectText");

    if(img.getAttribute("src") === "img/StartButton.png") {
        choose(selectText.value);
        renderText();
        inputBox.value = "";

        let d1 = new Date();
        let startTime = d1.getTime();
        let timer = setInterval(statistics, 1000);

        window.sessionStorage.setItem("timer", timer);
        window.sessionStorage.setItem("startTime", startTime);
        window.sessionStorage.setItem("index", 0);
        window.sessionStorage.setItem("errors", 0);

        img.setAttribute("src", "img/StopButton.png");
        inputBox.focus();

    }
    else if(img.getAttribute("src") === "img/StopButton.png") {
//        let d2 = new Date();
//        let endTime = d2.getTime();
//        let startTime = window.sessionStorage.getItem("startTime");
        let timer = window.sessionStorage.getItem("timer");
        clearInterval(timer);
//        console.log(endTime - startTime);

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

    document.getElementById("startStopBtn").addEventListener("click", function () {
        speedTyping();}, false);

    document.getElementById("inputBox").addEventListener(("input"), function () {
        dup1();}, false);


}

//runs when the page has been loaded an calls the proper functions
function start() {
    choose(0)
    changeLanguage("swedish")
    addListeners()


}

window.addEventListener("load", start, false);

