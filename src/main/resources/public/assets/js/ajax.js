/**
* @author: Oliver Faust
* Test stuff. Not used anymore!
*/

$(document).ready(function() {

var baseUrl = "https://gempen.herokuapp.com";
var dmnEvaluate =  '/rest/decision-definition/Decision_08ginzr_test:5:79264de1-56ba-11e9-ad77-8aa1d7eb306b/evaluate';


  $("#sendRequest").on("click", function(){

    var userName = $("#employeeName").val();
    var severenty = $("#severenty :selected").val();
    var requestBody = {
      variables : {
          priority: {
            value:severenty,
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
        console.log(data);
        if(data[0].incidentLevel.value == "low"){

          $("#userNameSpan").text(userName);
          $("#severentySpan").text(severenty);
          $("#chatbot").removeClass("hidden");
          $("#startForm").addClass("hidden");
        }else{
            $("#highPrio").removeClass("hidden");
            $("#startForm").addClass("hidden");
        }
      }
    });

  }); //End event handler
});//end on document ready
