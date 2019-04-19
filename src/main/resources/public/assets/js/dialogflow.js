

		var accessToken = "b7429c5e20a24f48b0a448b735a1c5d8";
		var baseUrl = "https://api.api.ai/v1/";

		var chatbotLanguage = "EN";

		function startChatbot(language){

				chatbotLanguage = language;

				if(language == "DE")
				{
					$("#chatbotHeaderMsg").text("Bitte wenden Sie sich mit ihrerm Problem an den Chatbot");
				}
				send("start");
		}

		$(document).ready(function() {
			$("#input").keypress(function(event) {
				if (event.which == 13) {
					event.preventDefault();
					if ($("#input").val().replace(/\s/g, "").length > 0) {
						setInputText();
						send($("#input").val());
					}

				}
			});
			$("#rec").click(function(event) {
				switchRecognition();
			});

			$("#send").click(function(event) {
				if ($("#input").val().replace(/\s/g, "").length > 0) {
					setInputText();
					send($("#input").val());
				}
			});


		});

		var recognition;

		function startRecognition() {
			recognition = new webkitSpeechRecognition();
			recognition.onstart = function(event) {
				updateRec();
			};
			recognition.onresult = function(event) {
				var text = "";
			    for (var i = event.resultIndex; i < event.results.length; ++i) {
			    	text += event.results[i][0].transcript;
			    }
			    setInput(text);
				stopRecognition();
			};
			recognition.onend = function() {
				stopRecognition();
			};
			recognition.lang = "en-US";
			recognition.start();
		}

		function stopRecognition() {
			if (recognition) {
				recognition.stop();
				recognition = null;
			}
			updateRec();
		}

		function switchRecognition() {
			if (recognition) {
				stopRecognition();
			} else {
				startRecognition();
			}
		}

		function setInput(text) {
			$("#input").val(text);
			send();
		}

		function updateRec() {
			$("#rec").text(recognition ? "Stop" : "Speak");
		}

		function sendBtn(e){
			console.log(this);
			var postback = $(this).attr("data-postback");
			console.log(postback);
			send(postback);

			$processFlowController.createTicket(postback);


		}

		function send(text) {
			var loading = $("<div class='lds-ellipsis'><div></div><div></div><div></div><div></div>");
			var messageContainer = $("<tr><td class='server-response'><div class='alert '></div></td></tr>");
			messageContainer.find("div").append(loading);

			$("#responseTable >tbody").append(messageContainer);
			console.log(messageContainer);
			var objDiv = document.getElementById("responseTable");
			objDiv.scrollTop = objDiv.scrollHeight;


			$.ajax({
				type: "POST",
				url: baseUrl + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				data: JSON.stringify({ query: text, lang: chatbotLanguage, sessionId: "somerandomthing" }),

				success: function(data) {
					setResponse(JSON.stringify(data, undefined, 2));
					setResponseText(data, messageContainer);
				},
				error: function() {
					messageContainer.find("div").empty();
					messageContainer.find("div").append("<p>Internal Server Error</p>");
					setResponse("Internal Server Error");
				}
			});
			setResponse("Loading...");
		}

		function setResponse(val) {
			$("#response").text(val);
		}

		function setResponseText(data, messageContainer){
			var result = data.result;
			if (data.status.code !== 200) {
				messageContainer.find("div").empty();
				messageContainer.find("div").append("<p>Internal Server Error</p>");
				return;
			}
			messageContainer.find("div").empty();
			if (result.action == "input.unknown") {

				if (result.fulfillment.messages.length > 0) {
					var trElement = $("<div><h4>"+result.fulfillment.speech+"</h4><hr /><div class='list-group'></div></duv>");
					var trElementButtons;
					$(result.fulfillment.messages).each(function(index,element){
						if (element.type == 1) {
							trElement.find(".list-group").append("<a class='list-group-item'  target='_blank' href='http://kb.winmed.ch/files"+element.imageUrl+"'><h4 class='list-group-item-heading'>"+element.title+"</h4><p class='list-group-item-text'>Knowledgebase Artikel</p></a>");
						} else if (element.type == 4) {
							trElementButtons = parseType4(element).contents();
						}
					});
					if (result.fulfillment.messages.length > 2) {
						trElement.find("a").css("display", "none");
						trElement.find("a").slice(0, 3).css("display", "block");
						trElement.find(".list-group").append("<br /><a class='btn-showmore'>Mehr anzeigen</a>");
					}
					messageContainer.find(".alert").append(trElement.contents());
					messageContainer.find(".alert").append(trElementButtons);
				} else {
					// no results
					messageContainer.find(".alert").append("na");
				}

			} else {
				$(result.fulfillment.messages).each(function(index,element){
					if(element.type == 0) {
						// single text record
						messageContainer.find(".alert").last().append(element.speech);
						if (result.fulfillment.messages.length > 1) {
							var messageContainer2 = $("<tr><td class='server-response'><div class='alert '></div></td></tr>");
							messageContainer.parent().append(messageContainer2);
							messageContainer = messageContainer2;
						}

					} else if (element.type == 4) {
						messageContainer.find(".alert").last().append(parseType4(element,result).contents());
					}

				});
			}

			var table = $("#responseTable").height();
			var lastRow = $("#responseTable >tbody >tr ").last();
			var pos = $("#responseTable").height();

			console.log(lastRow.find("div").text());

			var objDiv = document.getElementById("responseTable");
			objDiv.scrollTop = objDiv.scrollHeight;

			$(".btn-showmore").click(function(e) {
				var div = $(this).parent();
				e.preventDefault();
				div.find("a:hidden").slice(0, 3).css("display", "block");
				if (div.find("a:hidden").length == 0) {
					$(this).fadeOut('slow');
				}
				var objDiv = document.getElementById("responseTable");
				objDiv.scrollTop = objDiv.scrollHeight;
			});

			$("#input").val("");
		}

		function parseType4(element,result) {
			// multiple buttons
			var trElement = $("<div></div>");
			trElement.append("<p>"+element.payload.title+"</p><br />");


			//var messages = element.payload.messages;
			if(element.payload.type == 1){
			//kb artikle
				if (result.fulfillment.messages.length > 0) {
					//var trElement = $("<div><h4>"+result.fulfillment.speech+"</h4><hr /><div class='list-group'></div></div>");
					var trElement = $("<div><div class='list-group'></div></div>");

					trElement.find(".list-group").append("<a class='list-group-item' target='_blank' href='http://kb.winmed.ch/files"+element.payload.imageUrl+"'><h4 class='list-group-item-heading'>"+element.payload.title+"</h4><p class='list-group-item-text'>Knowledgebase Artikel</p></a>");
					return trElement.contents();
				//	messageContainer.find(".alert").append(trElementButtons);
				}
			}else if(element.payload.type == 3){
				var trElement = $("<div><div class='list-group'></div></div>");

				trElement.find(".list-group").append("<h4 class='list-group-item-heading'>"+element.payload.title+"</h4><br><span>"+element.payload.subtitle+"</span><img width='100%' class='list-group-item' src="+element.payload.imageUrl+">");
				return trElement.contents();

			}else{
				//buttons

				if(element.payload.buttons == undefined) {
					var button = "<button class='btn btn-primary dialogflow-control-btn' data-postback="+element.payload.postback+">"+element.payload.text+"</button>";
					return $(button);
				} else {
					var buttons = element.payload.buttons;
					$(buttons).each(function(index,element){
						var btnEl = $("<button class='btn btn-primary dialogflow-control-btn' data-postback="+element.postback+">"+element.text+"</button>");

						btnEl.click(sendBtn);

						if (trElement == null) {
							trElement = btnEl;
						} else {
							trElement.append(btnEl);
						}

						trElement.parent().append("<br>");
					})

					console.log(trElement.html());
					return trElement;
				}
			}
		}

		function setInputText(){
			var inputText = $("#input").val();
			$("#responseTable >tbody").append("<tr><td class='user-request'><div class='alert pull-right'>"+inputText+"</div></td></tr>");
		}

		function getAllUserRequests(){

				var userRequests = "USER REQUESTS:  ";
			$( ".user-request" ).each(function( index , element) {

					var elText = 	$(element);
					var text = elText.find("div").text();
					console.log(text);
					userRequests += text + " ### ";
				//	var elText = 	$(element) " > div").text();
  				//console.log( elText);
					//userRequests += elText;
				});

			return userRequests;
		}
