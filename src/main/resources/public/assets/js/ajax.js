$(document).ready(function() {

var baseUrl = "https://gempen.herokuapp.com";
var dmnEvaluate =  '/rest/decision-definition/Decision_08ginzr_test:5:79264de1-56ba-11e9-ad77-8aa1d7eb306b/evaluate';


  $("#sendRequest").on("click", function(){

    var requestBody = {
      variables : {
          priority: {
            value:3,
            type: "long"
          }
        }
      };


    $.ajax({
  method: "POST",
  url: baseUrl + dmnEvaluate,
  contentType: "application/json; charset=utf-8",

  data: JSON.stringify(requestBody),
  success: function(data){
    alert("success");
    console.log(data);
  }
});
/*
    $.ajax({
				type: "POST",
				url: baseUrl + dmnEvaluate,
				contentType: "application/json; charset=utf-8",
				dataType: "json",

				data: JSON.stringify({ variables: { priority: {value:3, type:"long"}}}),

				success: function(data) {
          alert(data);

				}

      });//end ajax
*/
  }); //end event handler

});// end document ready
