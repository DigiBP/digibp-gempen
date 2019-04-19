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

  $("#prioFormButton").on("click", function(){

    $processFlowController.createTicket("create_prio_ticket");
  });


}
  ProcessFlowController.prototype.getUserInstanceVariables = function(){
    var _this = this;
    var userName = $("#employeeName").val();
    var userInstanceVariables ={
     userName :userName,
     hirarchyLevel : _this.getUserHirarchy(userName),
      preventWork : $("input[name='preventWork']:checked").val(),
      onSite : $("input[name='onSite']:checked").val(),
      voulnerable : $("input[name='voulnerable']:checked").val(),
      lang  : $("#language :selected").val(),
      email  : $("#employeeEmail").val(),
    };
    return userInstanceVariables;
  }

  ProcessFlowController.prototype.triggerIncidentProcess = function(){


    var _this = this;
   var user =   $processFlowController.getUserInstanceVariables();

    var requestBodyDMN = {
      variables : {
          language: {
            value:user.lang,
            type: "string"
          },
          hierarchylvl : {
            value: user.hirarchyLevel,
            type: "double"
          },
          work_impact : {
            value: user.preventWork,
            type: "boolean"
          },
          presence : {
            value: user.onSite,
            type: "boolean"
          },
          legal : {
            value: user.voulnerable,
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
         $(".userNameSpan").text(user.userName);
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

         startChatbot(user.lang);
         var requestBody = {"variables":
                             {"incidentLevel":
                               {"value": incidentLevel, "type": "string"}
                             }


                           };

         _this.$camundaManager.completeNextTask(requestBody);

       });
  }

  ProcessFlowController.prototype.createTicket = function(type){
      var _this = this;

      var msgName = type;
      var prio ="low";
      var content ="";
      var currentStatus ="";

      if(type == "create_ticket"){
          prio = "low"
          currentStatus = "open";
          content = getAllUserRequests();
      }else if(type == "problem_solved")
      {
        prio = "low"
        currentStatus = "closed";
          content = getAllUserRequests();
      }else if(type == "create_prio_ticket"){
        prio = "high"
        currentStatus = "open";
        content = $("#highPrioRequest").val();
      }

      var userInfos = _this.getUserInstanceVariables();
        var processVariables = {


                        "v_priorization" : {"value" : prio, "type": "String"},
                        "v_user_name" : {"value" : userInfos.userName, "type": "String"},
                        "v_user_hierarchy_lvl" : {"value" :  userInfos.hirarchyLevel, "type": "String"},
                        "v_email" : {"value" : userInfos.email, "type": "String"},
                        "v_content" : {"value" : content, "type": "String"},
                        "v_current_status" : {"value" : currentStatus, "type": "String"}
                      
                    };

          _this.$camundaManager.sendMessage(msgName,processVariables, function(){alert("Ticket created! Messagename: "+msgName)});


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
