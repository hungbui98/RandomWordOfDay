//----------------------------------
// global variables.
//----------------------------------
var g_iOS = Ti.Platform.name === "iPhone OS";
var g_mobileweb = Ti.Platform.name === "mobileweb";
var g_wsURL = 'http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
var g_userMessage = undefined;
var g_gettingWord = false;
var g_wordOfDay = null;
var g_wordCount = 0;

Ti.API.trace("Ti.Platform.name=" + Ti.Platform.name);
	
//----------------------------------
// key pressed event handler
//----------------------------------
function processKeyPressed(e){
	var msg = $.txtMessage.value;
	alert("keypressed");
	if (msg !== undefined) {
		Ti.App.Properties.setString('UserMessage', msg);
	}
 	if (e.keyCode === KeyEvent.KEYCODE_SPACE || e.keyCode === KeyEvent.KEYCODE_FORWARD_DEL  || e.keyCode === KeyEvent.KEYCODE_DEL){
 		doProcessMessage(e);
 	}	
}

//----------------------------------
// process user message
//----------------------------------
function doProcessMessage(e) {
	
	 //alert("MessageDate=" + Ti.App.Properties.getString("MessageDate") + "; WordOfDay=" + Ti.App.Properties.getString("WordOfDay"));
	
	var msg = $.txtMessage.value;
	
	if (msg !== undefined) {
		if (e !== undefined && msg.length <= 0) {
			alert("Error: Message can't be blank. Try again.");
			return;
		}
/*
		if (e !== undefined && msg === g_userMessage) {
			alert("Please enter a new message.");
			return;
		}
*/
		
		// save temp value.
		g_userMessage = msg;
		Ti.App.Properties.setString('UserMessage', msg);

		// process word of the day
		arrWords = msg.split(' ');
		
		if (!g_mobileweb){
			getWordOfDay();
		}
		var wordOfDay = g_mobileweb ?  getWordOfDay1() : g_wordOfDay;
		$.lblWordOfDay.text = "Word of Day: " + wordOfDay;
		//alert("wordOfDay=" + wordOfDay);
		
		if (wordOfDay === undefined || wordOfDay === null)
		{
			Ti.API.error('doProcessMessage(): Unable to get word of the day.');
			return;
		}
		
		wordOfDay = wordOfDay.trim();
		var count = 0;
		for (var i = 0; i < arrWords.length; i++){
			var word = arrWords[i];
			if (word !== undefined && word !== null && word != ""){
				word = word.trim();
				if (word === wordOfDay){
					// doesn't count if word of day is at last and the last character is not a space
					if (!(i === arrWords.length-1  && msg[msg.length-1] !== ' ')){
						count++;
					}
				}
			}
		}

		if (count != g_wordCount){
		   	Ti.Media.vibrate({ pattern: [0,500,100,500,100,500] });
			  Ti.API.trace("Word of day '" + wordOfDay + "' is found " + count + " times in your message.");
		} else {
			  Ti.API.trace("Word of day '" + wordOfDay + "' is not found in your message.");
		}
		if (g_iOS){
			$.tab1.badge = count;
		} else {
			$.tab1.title = "Word of the day count: " + count;
		}
		
		g_wordCount = count;
	}
}

//----------------------------------
// get word of day in android or iOS.
//----------------------------------
function getWordOfDay(){ 
	
	var msgDate = undefined;
	var wordOfDay = undefined;
	var today = new Date();
	
	msgDate = Ti.App.Properties.getString("MessageDate");
	wordOfDay = Ti.App.Properties.getString("WordOfDay");
	
	if (msgDate !== undefined && msgDate !== "" && wordOfDay !== undefined && wordOfDay !== ""){
		try{
			var d = new Date(msgDate);
			  Ti.API.trace("d = " + d);
			if (d !== undefined && d.getYear() === today.getYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate() ){
				// return saved word of day.
				return wordOfDay;
			}
		}
		catch (e) {
			Ti.API.error("Exception: " + e);
		}
	}
	
	// get word of day from web service.
	if (!g_gettingWord){
		
		//var g_wordOfDay;
		var g_xhr = Titanium.Network.createHTTPClient();
		g_xhr.timeout = 5000;
		
		g_xhr.onload = function(e) {
			g_gettingWord = false;
			//alert("this.responseText = '" + this.responseText + "'; ");
		    // this is where you would process the returned object.
		    if (this.responseText != null) {
			
		        var jsObj = JSON.parse(this.responseText);
		        // Do something with the object
				if (jsObj.word === undefined || jsObj.word === null) {
					  Ti.API.trace('Titanium not able to get word of the day.');
				}
				g_wordOfDay = jsObj.word.trim();
				if (g_wordOfDay === undefined || g_wordOfDay === null) {
					  Ti.API.trace('Titanium not able to get word of the day.');
				}
				if (g_wordOfDay === "") {
					  Ti.API.trace('Word of the day is blank. That is invalid.');
				}			
				Ti.App.Properties.setString('MessageDate', today.toLocaleDateString());
				Ti.App.Properties.setString('WordOfDay', g_wordOfDay);
		    } else {
		       Ti.API.trace("Webservice returned nothing");
		    }
		};
		 
		g_xhr.onerror = function(e) {
			g_gettingWord = false;
		    // This is where you would catch any errors thrown from calling the webservice. 
		    // e.error holds the error message
		    alert("xhr ERROR: " + e.error);
		    Ti.API.error("xhr ERROR: " + e.error);
		};
	
		g_xhr.open('GET', g_wsURL);
		g_xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
		g_gettingWord = true;
		g_xhr.send();
	}

	if (g_wordOfDay !== undefined && g_wordOfDay !== null){
		Ti.App.Properties.setString('MessageDate', today.toLocaleDateString());
		Ti.App.Properties.setString("WordOfDay", g_wordOfDay);
	}
	return g_wordOfDay;
}

//----------------------------------
// retreive word of day
//----------------------------------
function getWordOfDay1() {
	
	var msgDate = undefined;
	var wordOfDay = undefined;
	var today = new Date();
	
	msgDate = Ti.App.Properties.getString("MessageDate");
	wordOfDay = Ti.App.Properties.getString("WordOfDay");
	
	if (msgDate !== undefined && msgDate !== "" && wordOfDay !== undefined && wordOfDay !== ""){
		try{
			var d = new Date(msgDate);
			  Ti.API.trace("d = " + d);
			if (d !== undefined && d.getYear() === today.getYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate() ){
				// return saved word of day.
				return wordOfDay;
			}
		}
		catch (e) {
			Ti.API.error("Exception: " + e);
		}
	}
	
	// get word of day from web service.
	
	var xhr1 = new XMLHttpRequest();

	xhr1.open("GET", g_wsURL, false);
	xhr1.send(null);
	
	if (xhr1.status === 200) {
		  Ti.API.info("xhr1.responseText = " + xhr1.responseText);
		var json = JSON.parse(xhr1.responseText);
		if (json.word === undefined || json.word === null) {
			  Ti.API.trace('XMLHttpRequest not able to get word of the day.');
			return null;
		}

		wordOfDay = json.word.trim();
		Ti.App.Properties.setString('MessageDate', today.toLocaleDateString());
		Ti.App.Properties.setString('WordOfDay', wordOfDay);
		
		return wordOfDay;
	} else {
		Ti.API.trace('Unable to get word of the day: ' + xhr1.status);
	}
	
	return null;
}

//----------------------------------
// initialize values
//----------------------------------
function initValues() {
  	Ti.API.trace("UserMessage=" + Ti.App.Properties.getString("UserMessage"));
	$.txtMessage.value = Ti.App.Properties.getString("UserMessage") !== undefined ? Ti.App.Properties.getString("UserMessage") : "";
}

//----------------------------------
// initial code
//----------------------------------
$.index.open();
initValues();
setInterval(doProcessMessage, 1000);


