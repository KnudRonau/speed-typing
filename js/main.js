


function loadDoc() {

    var xmlRequester = new XMLHttpRequest();
    xmlRequester.open("get",  "texts.xml", false);
    xmlRequester.send();
    return xmlRequester.responseXML;
}

function parseToDoc(xml) {
    var x, i, txt, xmlDoc;
    xmlDoc = xml.responseXML;
    txt = "";
    x = xmlDoc.getElementsByTagName("title");
    for (i = 0; i < x.length; i++) {
        txt += x[i].childNodes[0].nodeValue + " | ";
    }

    document.getElementById("textContent").value = txt;

    document.getElementById("title").innerHTML = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
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

    document.getElementById("textContent").value = text;
    document.getElementById("title").innerHTML = title;
    document.getElementById("textInformation").innerHTML = author + " (" + words + " words, " + chars + "chars)";
}

//responsible for changing language
function changeLanguage(language) {
    var xml = loadDoc();
    var i = 0;
    var j = 0;
    if(language == "english") {
        j = j + 4;
    }
    for(i; i < 4; i++, j++) {
        var titleTag = xml.getElementsByTagName("title");
        var title = titleTag[j].childNodes[0].nodeValue;
        document.getElementById("option" + (i + 1)).innerHTML = title;
    }
    choose(document.getElementById("selectText").value);
}

function addListeners() {

    //adds listeners to language radio
    var radios = document.querySelectorAll('input[name="language"]');
    radios.forEach(radio => radio.addEventListener("change", function () {
        changeLanguage(radio.value); }, false));

    //adds listener to textSelector
    document.getElementById("selectText").addEventListener("change", function () {
             choose(this.value);}, false);




}

function start() {
    choose(0)
    changeLanguage("swedish")
    addListeners()
//    window.alert(document.getElementById("option" + (0 + 1)).innerHTML)

}



window.addEventListener("load", start, false);

