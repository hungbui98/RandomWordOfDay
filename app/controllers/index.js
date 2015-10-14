//----------------------------------
// global variables.
//----------------------------------
var g_iOS = Ti.Platform.name === "iPhone OS";
var g_wsURL = 'http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
var g_userMessage = undefined;

// key pressed event handler
function processKeyPressed(e){
	var msg = $.txtMessage.value;
	if (msg !== undefined) {
		Ti.App.Properties.setString('UserMessage', msg);
	}
 	if (e.keyCode === KeyEvent.KEYCODE_SPACE){
 		doProcessMessage(e);
 	}	
}

//----------------------------------
// process user message
//----------------------------------
function doProcessMessage(e) {
	
	 Ti.API.trace("MessageDate=" + Ti.App.Properties.getString("MessageDate") + "; WordOfDay=" + Ti.App.Properties.getString("WordOfDay"));
	
	var msg = $.txtMessage.value;
	
	if (msg !== undefined) {
		if (e !== undefined && msg.length <= 0) {
			alert("Error: Message can't be blank. Try again.");
			return;
		}
		if (e !== undefined && msg === g_userMessage) {
			alert("Please enter a new message.");
			return;
		}
		
		// save temp value.
		g_userMessage = msg;
		Ti.App.Properties.setString('UserMessage', msg);

		// process word of the day
		arrWords = msg.split(' ');
		
		var wordOfDay = getWordOfDay();
		Ti.API.trace(wordOfDay);
		
		if (wordOfDay === undefined || wordOfDay === null)
		{
			Ti.API.error('Unable to get word of the day.');
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

		if (count > 0){
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
	}
}

//----------------------------------
// retreive word of day
//----------------------------------
function getWordOfDay() {
	
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
			  Ti.API.trace('Unable to get word of the day.');
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
  	Ti.API.trace(Ti.App.Properties.getString("UserMessage"));
	$.txtMessage.value = Ti.App.Properties.getString("UserMessage") !== undefined ? Ti.App.Properties.getString("UserMessage") : "";
}

//----------------------------------
// initial code
//----------------------------------
$.index.open();
initValues();
doProcessMessage();


