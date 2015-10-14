// global variables.
var g_iOS = Ti.Platform.name === "iPhone OS";
var g_wsURL = 'http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
var g_userMessage = undefined;

function doProcessMessage(e) {
	//alert("MessageDate=" + Ti.App.Properties.getString("MessageDate") + "; WordOfDay=" + Ti.App.Properties.getString("WordOfDay"));
	
	var msg = $.txtMessage.value;
	if (msg !== undefined) {
		msg = msg.trim();
		if (msg.length <= 0) {
			alert("Error: Message can't be blank. Try again.");
			return;
		}
		if (msg === g_userMessage) {
			alert("Please enter a new message.");
			return;
		}
		
		// save temp value.
		g_userMessage = msg;
		Ti.App.Properties.setString('UserMessage', msg);

		// process word of the day
		arrWords = msg.split(' ');

		var wordOfDay = getWordOfDay();
		//alert(wordOfDay);
		
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
					count++;
				}
			}
		}

		if (count > 0){
		   	Ti.Media.vibrate({ pattern: [0,500,100,500,100,500] });
			//alert("Word of day '" + wordOfDay + "' is found " + count + " times in your message.");
		} else {
			//alert("Word of day '" + wordOfDay + "' is not found in your message.");
		}
		if (g_iOS){
			$.tab1.badge = count;
		} else {
			$.tab1.title = "Count word of the day: " + count;
		}
	}
}

function getWordOfDay() {
	
	var msgDate = undefined;
	var wordOfDay = undefined;
	var today = new Date();
	
	msgDate = Ti.App.Properties.getString("MessageDate");
	wordOfDay = Ti.App.Properties.getString("WordOfDay");
	
	if (msgDate !== undefined && msgDate !== "" && wordOfDay !== undefined && wordOfDay !== ""){
		try{
			var d = new Date(msgDate);
			//alert("d = " + d);
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
		//alert("xhr1.responseText: " + xhr1.responseText);
		var json = JSON.parse(xhr1.responseText);
		if (json.word === undefined) {
			//alert('Unable to get word of the day.');
			return null;
		}

		wordOfDay = json.word.trim();
		Ti.App.Properties.setString('MessageDate', today.toLocaleDateString());
		Ti.App.Properties.setString('WordOfDay', wordOfDay);
		
		return wordOfDay;
	} else {
		//Ti.API.error(xhr1.status);
	}
	
	return null;
}

function initValues() {
	//alert(Ti.App.Properties.getString("UserMessage"));
	$.txtMessage.value = Ti.App.Properties.getString("UserMessage") !== undefined ? Ti.App.Properties.getString("UserMessage") : "";
}

$.index.open();
initValues();
doProcessMessage(null);


