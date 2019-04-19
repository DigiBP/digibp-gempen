/*on document ready*/
$( function() {
	var $processFlowController = getPFCInstance();
});

/*Singleton*/
var $processFlowController = null;
function getPFCInstance() {

	if ($processFlowController == null) {
		$processFlowController = new ProcessFlowController();
	}
	return $processFlowController;
}

//ProcessFlowController Class
function ProcessFlowController(){

  this.$camundaManager = new getCamundaManagerInstance();

  this.registerEventHandlers();




}

ProcessFlowController.prototype.getUserHirarchy = function(name){
  const USERS = {
        "Oliver Faust" : 5,
        "David Morandi" : 6,
        "Max Muster" : 2,
        "tester" : 1,
      };
    var level = 1;
    try{
      level  = USERS[name];
    }catch(err){
    console.log("unknown user");
    }

    return level;

}

ProcessFlowController.prototype.registerEventHandlers = function(){
  console.log("start registering eventhandlers");
  var _this = this;


  $("#startFormBtn").on("click", function(){

    //start new process instance in camunda
    _this.$camundaManager.startProcess("incident_process_2", "bkey", _this.triggerIncidentProcess);



  });


  ProcessFlowController.prototype.triggerIncidentProcess = function(){

    var userName = $("#employeeName").val();
    var hirarchyLevel = _this.getUserHirarchy(userName);
     var preventWork = $("input[name='preventWork']:checked").val();
     var onSite = $("input[name='onSite']:checked").val();
     var voulnerable = $("input[name='voulnerable']:checked").val();
     var lang  = $("#language :selected").val();

    var requestBodyDMN = {
      variables : {
          language: {
            value:lang,
            type: "string"
          },
          hierarchylvl : {
            value:hirarchyLevel,
            type: "double"
          },
          work_impact : {
            value:preventWork,
            type: "boolean"
          },
          presence : {
            value:onSite,
            type: "boolean"
          },
          legal : {
            value:voulnerable,
            type: "boolean"
          }

        }
      };

      //const dmnID = "Decision_0pa8gvl:23:3f40bd1c-61db-11e9-8454-3e7b74bbc4b0";
      const dmnID = "key/Decision_0pa8gvl";
      _this.$camundaManager.evaluateDMN(dmnID,requestBodyDMN, function(response){

         console.log("response from callback:");
         console.log(response);
         console.log("----");
         var incidentLevel = "green";
         if(response.length > 0){
           incidentLevel = response[0].incidentlevel.value;
         }

         alert("incident level: "+ incidentLevel);
         $(".userNameSpan").text(userName);
         $(".severentySpan").text(incidentLevel);

         if(incidentLevel == "red"  ){
           incidentLevel = "high";
           $("#highPrioForm").removeClass("hidden");
           $("#startForm").addClass("hidden");

         }else{
           incidentLevel = "low";
           $("#chatbot").removeClass("hidden");
           $("#startForm").addClass("hidden");
         }

         startChatbot(lang);
         var requestBody = {"variables":
                             {"incidentLevel":
                               {"value": incidentLevel, "type": "string"}
                             }


                           };

         _this.$camundaManager.completeNextTask(requestBody);

       });
  }

  /*
    $("#testComplete").on("click", function(){

      console.log("testComplete clicked!");
      var requestBody = {"variables":
                          {"incidentLevel":
                            {"value": "high", "type": "string"}
                          }
                        };

      _this.$camundaManager.completeNextTask(requestBody);
    });


    $("#sendRequest").on("click", function(){

      var dmnID = "Decision_08ginzr_test:5:79264de1-56ba-11e9-ad77-8aa1d7eb306b";
      var requestBody = {"variables":
                           {"priority" :
                            { "value" : 2, "type" : "long" }
                          }
                        };

      _this.$camundaManager.evaluateDMN(dmnID,requestBody, function(){
         alert("callback fired!");
      });

    });
  */



}
