let assistIndex = 0;

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
    var xml = loadDoc();
    var titleTag = xml.getElementsByTagName("title");
    var authorTag = xml.getElementsByTagName("author");
    var textTag = xml.getElementsByTagName("text");

    var title = titleTag[i].childNodes[0].nodeValue;
    var author = authorTag[i].childNodes[0].nodeValue;
    var text = textTag[i].childNodes[0].nodeValue;
    var words = text.split(" ").length;
    var chars = text.length;

    document.getElementById("textContent").innerHTML = text;
    document.getElementById("title").innerHTML = title;
    document.getElementById("textInformation").innerHTML = author + " (" + words + " words, " + chars + "chars)";
}

//responsible for changing language
function changeLanguage(language) {
    var xml = loadDoc();
    var i = 0;
    var j = 0;
    if(language === "english") {
        j = j + 4;
    }
    for(i; i < 4; i++, j++) {
        var titleTag = xml.getElementsByTagName("title");
        var title = titleTag[j].childNodes[0].nodeValue;
        document.getElementById("option" + (i + 1)).innerHTML = title;
    }
    choose(document.getElementById("selectText").value);
}

function dup() {
    var text = document.getElementById("textContent").querySelectorAll("span");
    var charVal = document.getElementById("inputBox").value.split("");
    dup1();

    text.forEach((charSpan, index) => {
        index += assistIndex;
        var char = charVal[index];
        if (char == null) {
            charSpan.classList.remove("correct");
            charSpan.classList.remove("incorrect");

        }
        else if (char === charSpan.innerText) {
            charSpan.classList.add("correct");
            charSpan.classList.remove("incorrect");

        }
        else {
            charSpan.classList.add("incorrect");
            charSpan.classList.remove("correct");

        }
        if(charVal[index] === " ") {
            assistIndex += index;
            document.getElementById("inputBox").value = "";
        }

    })
}

function dup1() {
    let text = document.getElementById("textContent").querySelectorAll("span");
    let index = window.sessionStorage.getItem("index");
    let nextIndex = parseInt(index) + 1;
    let input = document.getElementById("inputBox").value.split("");

    if(text[index].innerText === (input[input.length -1])) {
        text[index].classList.add("correct");
    } else {
        text[index].classList.add("incorrect");
    }
    text[index].classList.remove("current");
    if(input[input.length -1] === " ") {
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
    var text = document.getElementById("textContent").innerHTML;
    document.getElementById("textContent").innerHTML = "";
    text.split('').forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character;
        document.getElementById("textContent").appendChild(characterSpan);

    })

    document.getElementById("textContent").querySelector("span").classList.add("current");

}



function speedTyping() {
    var img = document.getElementById("startStopBtn");
    var inputBox = document.getElementById("inputBox");
    var selectText = document.getElementById("selectText");

    if(img.getAttribute("src") === "img/StartButton.png") {
        choose(selectText.value);
        renderText();
        inputBox.value = "";

        let d1 = new Date();
        let startTime = d1.getTime();
        window.sessionStorage.setItem("startTime", startTime);

        window.sessionStorage.setItem("index", 0);

        img.setAttribute("src", "img/StopButton.png");
        inputBox.focus();

    }
    else if(img.getAttribute("src") === "img/StopButton.png") {
        let d2 = new Date();
        let endTime = d2.getTime();
        let startTime = window.sessionStorage.getItem("startTime");
        console.log(endTime - startTime);

        img.setAttribute("src", "img/StartButton.png");
    }

}

//adds listeners
function addListeners() {

    //adds listeners to language radio
    var radios = document.querySelectorAll('input[name="language"]');
    radios.forEach(radio => radio.addEventListener("change", function () {
        changeLanguage(radio.value); }, false));

    //adds listener to textSelector
    document.getElementById("selectText").addEventListener("change", function () {
             choose(this.value);}, false);

    document.getElementById("startStopBtn").addEventListener("click", function () {
        speedTyping();}, false);

    document.getElementById("inputBox").addEventListener(("input"), function () {
        dup1();}, false);

//    document.getElementById("inputBox").addEventListener((""))


}

//runs when the page has been loaded an calls the proper functions
function start() {
    choose(0)
    changeLanguage("swedish")
    addListeners()


}

window.addEventListener("load", start, false);

