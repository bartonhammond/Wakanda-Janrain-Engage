/**
* http://developers.janrain.com/documentation/api/auth_info/
*
* Note: not using TWITTER 'cause it won't reveal the email
*       see - https://rpxnow.com/docs/providers
*/

/**
* Expected POST from janrain but receive GET instead
*/

function janrainresponse(request, response) {
		response.contentType = 'text/plain';
		var tokens = request.urlQuery.split('=');
		var token = tokens[1];
		
	//see docs:	
	//https://rpxnow.com/api/v2/auth_info	
	var apiKey = '2018411bdba5ccf6d6549e01a492941e885e8435';
	var extended = 'false';
 	var tokenURL = 'http://www.trashers.org/janrainresponse.html';
   
   	//URL for auth_info - where you get the user's email 
	var URLJson = "https://rpxnow.com/api/v2/auth_info?apiKey=" + apiKey +
		"&token=" + token + 
		"&extended=true" +
		"tokenURL=" + tokenURL;

	//Send request
	var xhr = new XMLHttpRequest();
	xhr.open('GET', URLJson, false);
	xhr.send();
	
	//Parse result to object
	var dataObj = JSON.parse(xhr.responseText);
	var now = new Date();

	//Need Users security to read user table
	var promoteToken = currentSession().promoteWith("Users"); 
	
	//Do we have a user?
	var user = ds.User.find("email= :1 and providerName = :2 ",
	   dataObj.profile.email, dataObj.profile.providerName);
	
	//Nope
	if (user === null) {
		//Create one
		var aUser = new ds.User({
			email: dataObj.profile.email,
			displayName: dataObj.profile.displayName,
			providerName: dataObj.profile.providerName,
			createdDate: now,
			lastLoginDate: now
			});
		//Save User
		aUser.save();
		
		//Check if user exists in Directory
		var dirUser = directory.user(dataObj.profile.email);
		if (dirUser === null) {
			//Add user and put into Users group
			var dirUser = directory.addUser(dataObj.profile.email,
				'1234',
				dataObj.profile.displayName);
			directory.save();
			dirUser.putInto('Users');
			directory.save();
		}
	} else {
		user.lastLoginDate = now;
		user.save();
	}
	
	//Unpromote temporary session
	currentSession().unPromote(promoteToken); //put the session back to normal.
	
	//Login to Wakanda
	loginByPassword(dataObj.profile.email,'1234',60*60) ; // one hour
	
	//http://forum.wakanda.org/showthread.php?1245-redirect-to-a-given-url-from-server-side&highlight=redirect
	response.statusCode = 307; // Temporary Redirect
	response.headers.Location = 'allusers.html';
	
}