$(document).ready(function() {

var baseUrl = "https://gempen.herokuapp.com";

  $("#sendRequest").on("click", function(){



    $.ajax({
				type: "POST",
				url: baseUrl + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				data: JSON.stringify({ query: "hi", lang: "en", sessionId: "somerandomthing" }),

				success: function(data) {
          alert(data);
				/*	setResponse(JSON.stringify(data, undefined, 2));
					setResponseText(data, messageContainer);
          */
				},
				error: function() {
          alert("error");
          /*
					messageContainer.find("div").empty();
					messageContainer.find("div").append("<p>Internal Server Error</p>");
					setResponse("Internal Server Error");
          */
				}

  });

});
