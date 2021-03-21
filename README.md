# Project 
## Environment & Tools
Operating System: Windows 10 Home   
Git version: 2.29.2   
IDE: WebStorm 2020.3.3

## Purpose
The purpose of this assignment is to create a feature-rich web application, which let's the user test his abilities to type quickly, while providing real-time statistics. 

## Procedures
I started out by fully creating the HTML-file with all the elements I thought would be necessary. This was mostly a straight forward process. At first I used a ```<textarea>``` for the actual text content, but later switched it to an ordinary paragraph, when I implemented the JavaScript, as this worked better with my ```<span>``` elements.

Afterwards it was time for CSS. I chose a background I thought appropriate, and sat the max-width of the body to 600px and margin to auto in order to comply with the requirements. I chose some colors, which I thought would match nicely and used those throughout the page for styling. 

To be frank, I still find working with CSS to be a march of trial and error until the page finally matches what I envisioned to begin with. ```Display: inline-block``` was used to make the elements in the header appear beside each other, the same was the case with the casing checkbox and the language radios. 

Directly below the language selection I placed the text options, as I thought these two belonged a bit together. 

For the text area I created a div, which I know we should strive not to use, but I thought it was entirely appropriate in this case. I gave it a boarder, and determined its width using percentage, so that it filled the 600 pixels of page. The text content and information about the text was aligned in accordance with the requirements, and the text content was spaced a bit for improved readability when the game is running. 

Underneath in the center I placed the input box and the start/stop button. 

With a further amount of trial and error, I placed the statistics in a centered 2x2 grid with the canvas centered directly underneath it. style-wise I tried to match the canvas, text area and text options. 

I figured my solution would be based on a function called ´´´start()´´´, which would called on load of the page. This function should then call a few other functions load an initial text and set up functionality. The most important of these is ```addListeners()```, which has the purpose of adding eventListeners to different HTML-elements. In order to do this though I had to create the functions to run when an event occurs first, so this is where I began.

I knew I wanted to aim at least for a B, so I started by implementing the functions for loading texts from an XML-file. To begin with, I went about it an idiotic way, as I wanted to convert the XML file to JavaScript objects via JSON. After some frustration, I finally realized that the desired data was readily available after being loaded using ```XMLHttpRequest()```. ```loadDoc(i)``` got the responsibility of opening the XML-file and returning it in a usable format. 

The function for displaying the desired text, ```loadText(i)``` was thereafter straightforward; simply fetching the values from the Document returned by ```loadDoc(i)``` and setting the innerHTML of the appropriate HTML-elements to these. ```.length``` of the text returns the number of characters in the String and ```.length``` of the Array of words split by each space returns the number of words for further info about the text. 

```loadText(i)``` is called by the function ```choose(i)```, whose only purpose is to check, if the language is set to english. if it is, the value is incremented by 4, since it is the last 4 texts, that are in english. ```choose(i)``` is when a change-event happens on the "selectText"-element, thus making it possible to change text using those options. 

A change-Eventlistener is also added to the language radios, which calls the ```changeLanguage(language)``` function. This functionen traverses either the first or the last 4 text titles based on the language, and sets these titles as innerHTML for the 4 options. The function also calls ```choose(i)``` in order to update the text area when the language is changed. 

In order to implement the game's functionality, the text first had to be rendered into sepereate span-elements. ```renderText()``` takes the current text, splits is into an Array, and creates a span-element for each object in the Array. These are then added to the text Content, which was emptied just before this process. In order to make the text fully ready to start the game, the first span-element has the class "current" added, which the CSS highlights as the next character to type.

With the text rendered, I created ```keyPress()``` which is called with each input-event in the inputBox. With this solution of repeatedly calling this function during the game, I had to store an index-value for progress between the calls. I ended up storing this in a global obect called variables. This makes it possible for ```keyPress()``` to compare the reached span-element with the last input in the input box. If they are equal, the span is set to correct, which turns it green. If not it is turned red, or gets a red underline if it's a space. 



## Discussion


