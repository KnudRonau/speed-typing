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

I figured my solution would be based on a function called ``start()``, which would called on load of the page. This function should then call a few other functions load an initial text and set up functionality. The most important of these is ```addListeners()```, which has the purpose of adding eventListeners to different HTML-elements. In order to do this though I had to create the functions to run when an event occurs first, so this is where I began.

I knew I wanted to aim at least for a B, so I started by implementing the functions for loading texts from an XML-file. To begin with, I went about it an idiotic way, as I wanted to convert the XML file to JavaScript objects via JSON. After some frustration, I finally realized that the desired data was readily available after being loaded using ```XMLHttpRequest()```. ```loadDoc(i)``` got the responsibility of opening the XML-file and returning it in a usable format. 

The function for displaying the desired text, ```loadText(i)``` was thereafter straightforward; simply fetching the values from the Document returned by ```loadDoc(i)``` and setting the innerHTML of the appropriate HTML-elements to these. ```.length``` of the text returns the number of characters in the String and ```.length``` of the Array of words split by each space returns the number of words for further info about the text. 

```loadText(i)``` is called by the function ```choose(i)```, whose only purpose is to check, if the language is set to english. if it is, the value is incremented by 4, since it is the last 4 texts, that are in english. ```choose(i)``` is when a change-event happens on the "selectText"-element, thus making it possible to change text using those options. 

A change-Eventlistener is also added to the language radios, which calls the ```changeLanguage(language)``` function. This functionen traverses either the first or the last 4 text titles based on the language, and sets these titles as innerHTML for the 4 options. The function also calls ```choose(i)``` in order to update the text area when the language is changed. 

In order to implement the game's functionality, the text first had to be rendered into sepereate span-elements. ```renderText()``` takes the current text, splits is into an Array, and creates a span-element for each object in the Array. These are then added to the text Content, which was emptied just before this process. In order to make the text fully ready to start the game, the first span-element has the class "current" added, which the CSS highlights as the next character to type.

With the text rendered, I created ```keyPress()``` which is called with each input-event in the inputBox. With this solution of repeatedly calling this function during the game, I had to store an index-value for progress between the calls. I ended up storing this in a global obect called variables. This makes it possible for ```keyPress()``` to compare the reached span-element with the last input in the input box. If they are equal, the span is set to correct, which turns it green. If not it is turned red, or gets a red underline if it's a space, and the global variable ```errors```, which was added later for statistical purposes, is incremented. If the input is a space, the inputBox is cleared in accordance with the requirements. In order to stop the game if all the characters have been typed, I added an if-statement at the end to check if there are any characters left. If there aren't, the game is stopped, otherwise the next character in the text is set to current, and the index is incremented. 

In order to properly start and stop a game, ```speedTyping()``` is called when the start/stop-button is clicked. An if-statement checks if the game should be started or stopped based on the current image the button has. If it should start, ``choose(i)`` and ``renderText()`` are called, so that if the game has already been played, the text is reset and ready for another try. Furthermore, It calls the function ``setStartValues()`` whose purpose is to reset the global ``index`` and ``error`` values, and set an interval and store a starting time. The time is stored globally to access it repeatedly for statistical purposes and the timer is stored globally to be able to stop it again later when the game is finished. ``drawCanvas`` clears the canvas if the game has been played before, and sets it up with new guiding lines. Additionally I added ``ctx.beginPath()`` so that drawstats could "paint" from an already started line.

The ``setInterval()`` object is at the beginning of a game set to run every second, calling ``statistics()``. This was a very straightforwrard function to implement, as the formulas we had to use were provided. The stored starting time is used for calculating passed time, and ``index`` and ``errors`` is used to calculate the rest of the statistics. After implementing the canvas, I added a call to the function ``drawStats(...)``, as this should also be called once a second, and with some of the data already calculated in ``statistics()``.  

``drawstats(...)`` then depicts a line which progresses 2 pixels each second in the canvas, always showing the progress of averge words per minuts.

When the whole text has been played through or the player clicks on the red stop button, the ``setInterval()`` timer is cleared so that no more stats will pop up, and the button is switched back to a play button.

## Discussion
I would definetely say that the purpose of the project has been fulfilled. All of the features work properly without any lagging. 

To begin with I used a ``textarea`` for the text content, but when I came to the part of rendering to text into span-elements this proved foolish, so I switched it to a regualar p-element. 

For the statistics I chose a Description List, the description for when to use this matches quite well with what was need here. 

As I am sure is obvious, my layout was largely inspired by the provided material with a few tweaks, which I thought makes my page a bit prettier. 

For the animation I chose to add some letters, which would change color between the colors of a highlighted character and a correct input. This is both simple, looks good and makes sense when looking at the page. 

I know many things could have been done differently in the Javascript. I tried avoiding using globals, but with this solution I couldn't figure a way. For some time I used sessionStorage in my solution to avoid globals, but thankfully asked and was told, that I was being stupid. I chose to create the one global object instead of having 4 global variables, as I figured the fewer the better. Additionally it's much harder to meddle with the variables by mistakes, when you have to write ``variables.index`` to access it. 

I know that provided texts all have a language tag, and that it would therefore make sense to determine language of the text by this value, but in this case with the texts nicely ordered, I found my solution of adding 4 to the number of it should be english much simpler. This would however have to be changed, if the texts weren't ordered this way. 

I decided to make each canvas progression 2 pixls, as this gave some visual indication of the game's progress, while still providing time for slow writers to finish the game with a visualization of it all. I figured it would make the graph start at 0, which is why ``drawCanvas`` moves the starting spot to this corner. 

I don't know if there's a dedicated way to compare characters without casing, so I simply used ``toLowerCase()`` on them both if casing should be ignored. This also makes it possible to turn it on and off during a game if wanted. 

I wanted to visualize errors when space should have been the input, so added the ``.incorrectSpace`` for these cases. which underlines it in red. I also thought about red background for these, but this was very intrusive. Additionally I chose darkred instead of normal red as I think this matched the style better.

I think the netWPM formula is a bit weird as it let's the user get a massive number of negative netWPM, but since it's the provided one I didn't think that much of it. 

I think I could have avoided the the ``Date()`` object altogether by just letting the ``setInterval()`` object control the time, but I realized that too late, and in the end I don't think it makes a difference. 

Throughout the JavaScript I've been wondering whether HTML values should be stored in variables at the beginning of functions of if they should be retrieved when needed in the function. I decided on loading them in variables in most cases, as I think this improves readability, however at the expense of having more code.

All in all I have no doubt a better solution could have been implemented, but I am still pleased with my result. It lives up to all requirements and supports all features. 

As with the laborations I feel like I learned a great deal from this project. A great deal of the CSS and JavaScript was something I had to look up while doing the project, thereby learning most of what is used in the project. 

