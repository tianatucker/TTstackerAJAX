// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showQuestion = function(question) {

	// clone our result template code
	var result = $('.templates .question').clone();

	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the .viewed for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);
	console.log(asker);
	return result;
};

//this function returns new results about top users to the DOM
/*var showUsers = function(answerers) {

	// clone our result template code
	var result = $('.templates .top-answerers').clone();

	// set some properties related to top users
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + answerers.user.user_id + ' >' +
		answerers.user.display_name +
		'</a></p>' +
		'<p>Reputation: ' + answerers.score + '</p>'
	);

	return result;
};

function showAnswerers(results){
	var html = "";
	$.each(results, function(index,value){
		html += '<p>'+ value.user.display_name + '</p>';
	})
}*/


// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {

	// the parameters we need to pass in our request to StackOverflow's API
	var request = {
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};

	$.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET",
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var topScorers = function(tags) {

	// the parameters we need to pass in our request to StackOverflow's API
	$.getJSON('http://api.stackexchange.com/2.2/tags/'+tags+ '/top-answerers/all_time?site=stackoverflow', function(data){
		console.log(data);
		showResults(data.items);
	})
	/**var request = {
		tagged: tags,
		'': 'html/top-answerers/all_time?',
		site: 'stackoverflow'
	};

	$.ajax({
		url: "http://api.stackexchange.com/2.2/tags",
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET",
	})**/
	//.done(function(result){ //this waits for the ajax to return with a succesful promise object
		//var searchResults = showSearchResults(request.tagged, result.items.length);

		//$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		/*$.each(result.items, function(i, item) {
			var question = showUsers(item);
			$('.results').append(question);
		});*/
		function showResults(results){
		var html = "";
			$.each(results, function(index,value){
			html += '<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + value.user.user_id + ' >' +
		value.user.display_name +
		'</a></p>' +
		'<p>Reputation: ' + value.user.reputation + '</p><br />'

			//'<p>' + value.user.display_name + '</p>';
			console.log(value.user.display_name);
			});
			$('.high-scorers').html(html);
			}
	//})


	/*.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});*/
};


$(document).ready( function() {
	$('.unanswered-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
	$('.inspiration-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='answerers']").val();
		topScorers(tags);
	});
});
