function getIndicesOf(searchStr, str, caseSensitive) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function doProcessMessage(e) {
    alert(Ti.App.Properties.getString("UserMessage"));
    var msg = $.txtMessage.value;
    if (msg !== undefined){
    	msg = msg.trim();
    	if (msg.length <= 0){
    		alert("Error: Message can't be blank.");
    		return;
    	}
    	Ti.App.Properties.setString('UserMessage', msg);
	
		// process word of the day
    	arrWords = msg.split(' ');
    	
    	var arrIndices = getIndicesOf("hi", msg, true);
    	alert(arrIndices);
    	
    	//for (word in arrWords){
    		
    	//}
    	
    	getWordOfDay();
    }
}


var arrWords = null;
var xhr = Titanium.Network.createHTTPClient();

xhr.onload = function(e) {
	
	alert(this.responseText);
    // this is where you would process the returned object.
    if (this.responseText != null) {
	
        var jsObj = JSON.parse(this.responseText);
        // Do something with the object
    } else {
       alert("Webservice returned nothing");
    }
};
 
xhr.onerror = function(e) {
    // This is where you would catch any errors thrown from calling the webservice. 
    // e.error holds the error message
    alert("ERROR: " + e.error);
};

function getWordOfDay(){ 
	var wsURL = "http://maps.google.com/maps/api/geocode/json?address=";
	//var wsURL = 'http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
	//xhr.open('GET', wsURL);
	//xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
	//xhr.send();
	
	var jqxhr = $.getJSON( wsURL, function() {
	  console.log( "success" );
	})
	  .done(function() {
	    console.log( "second success" );
		alert("this.responseText: " + this.responseText);
		var json = JSON.parse(this.responseText);
		if (json.word === undefined) {
			alert('Unable to get word of the day.');
			return;
		}
	  })
	  .fail(function(e) {
	    console.log( "error" );
		Ti.API.error(e.error);
		alert("ERROR1: " + e.error);
	  })
	  .always(function() {
	    console.log( "complete" );
	  });
	  
/*
  	var xhr1 = Titanium.Network.createHTTPClient();
	xhr1.open('GET', wsURL);
	
	xhr1.onload = function() {
	
		alert("this.responseText: " + this.responseText);
		var json = JSON.parse(this.responseText);
		if (json.word === undefined) {
			alert('Unable to get word of the day.');
			return;
		}

	};
	xhr1.onerror = function(e) {
		Ti.API.error(e.error);
		alert("ERROR1: " + e.error);
	};
	
	xhr1.send();	
*/
}


function initValues(){
	//alert(Ti.App.Properties.getString("UserMessage"));
	$.txtMessage.value = Ti.App.Properties.getString("UserMessage") !== undefined ? Ti.App.Properties.getString("UserMessage") : "";
}

initValues();
$.index.open();
