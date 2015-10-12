
function doProcessMessage(e) {
	//alert(Ti.App.Properties.getString("UserMessage"));
	var msg = $.txtMessage.value;
	if (msg !== undefined) {
		msg = msg.trim();
		if (msg.length <= 0) {
			alert("Error: Message can't be blank. Try again.");
			return;
		}
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
			alert("Word of day '" + wordOfDay + "' is found " + count + " times in your message.");
		} else {
			alert("Word of day '" + wordOfDay + "' is not found in your message.");
		}
	}
}

function getWordOfDay() {
	var wsURL = 'http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
	
	var xhr1 = new XMLHttpRequest();

	xhr1.open("GET", wsURL, false);
	xhr1.send(null);
	
	if (xhr1.status === 200) {
		//alert("xhr1.responseText: " + xhr1.responseText);
		var json = JSON.parse(xhr1.responseText);
		if (json.word === undefined) {
			//alert('Unable to get word of the day.');
			return null;
		}
		return json.word;
	} else {
		//Ti.API.error(xhr1.status);
	}
	
	return null;
}

function initValues() {
	//alert(Ti.App.Properties.getString("UserMessage"));
	$.txtMessage.value = Ti.App.Properties.getString("UserMessage") !== undefined ? Ti.App.Properties.getString("UserMessage") : "";
}

initValues();
$.index.open();

/*
var window = {}; var document = { getElementById: function(){}, createComment: function(){}, documentElement: { insertBefore: function(){}, removeChild: function(){} }, createElement: function(elm){ return obj = { innerHTML: '', appendChild: function(){}, getElementsByTagName: function(){ return {}; }, style: {} },
}
}; var navigator = { userAgent: "" }; var location = { href: '' };*/

