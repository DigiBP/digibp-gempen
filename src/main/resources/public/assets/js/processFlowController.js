/**
* @author: Oliver Faust
* This Class provides functionallity to steer the process flow.
*/

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

  this.businessKey = guid();
  this.registerEventHandlers();

 	this.USERS = {};

	this.loadUsers();

	$("#employeeName").focusout(function(){
		try{
			var user = $("#employeeName").val();
			var 	userObj  = $processFlowController.getUserObjectByName(user);
		 $("#employeeEmail").val(userObj.email);
		  $("#language").val(userObj.language);
		}catch(err){
		console.log("unknown user");
		}

	});

}

ProcessFlowController.prototype.loadUsers = function(){
	var _this = this;
  $.ajax({
      url: "https://hook.integromat.com/ojx7opxw88pitz5uaw7py40hnlyvcy51",
      method: "GET",
      contentType: "application/json; charset=utf-8",
      success: function(response){

				_this.USERS = response.level;
				console.log(_this.USERS);
      },
      error:function(response){ console.log("error in GET request"); console.log(response);}
    });

}


ProcessFlowController.prototype.getUserObjectByName = function(value){
var _this = this;


for (var i = 0; i < _this.USERS.length; i++) {
		if (_this.USERS[i]['name'] === value) {
				return _this.USERS[i];
		}
}
return null;

}


ProcessFlowController.prototype.getUserHirarchy = function(name){

var _this = this;
/*
  const USERS = {
        "Oliver Faust" : 5,
        "David Morandi" : 6,
        "Max Muster" : 2,
        "tester" : 1,
      };
			*/
    var level = 1;
    try{
      level  = _this.USERS[name];
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
    _this.$camundaManager.startProcess("incident_process_2", _this.businessKey, _this.triggerIncidentProcess);



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
     hirarchyLevel : _this.getUserObjectByName(userName).level,
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
				 var employeePrio = incidentLevel;

//         alert("incident level: "+ incidentLevel);
console.log(incidentLevel);
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
				 				[
                             {"incidentLevel":
                               {"value": incidentLevel, "type": "string"}
                             },
														 {"employeePrio":
                               {"value": employeePrio, "type": "string"}
                             }
]


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
			var callback = function(){console.log("ticket created");};


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
				callback = function(){ $("#highPrioForm").addClass("hidden");  $("#ticketCreatedArea").removeClass("hidden"); }
      }

      var userInfos = _this.getUserInstanceVariables();
        var processVariables = {

                        "v_incident_number" : {"value" :  $processFlowController.businessKey, "type": "String" } ,
                        "v_priorization" : {"value" : prio, "type": "String"},
                        "v_user_name" : {"value" : userInfos.userName, "type": "String"},
                        "v_user_hierarchy_lvl" : {"value" :  userInfos.hirarchyLevel, "type": "String"},
                        "v_email" : {"value" : userInfos.email, "type": "String"},
                        "v_content" : {"value" : content, "type": "String"},
                        "v_current_status" : {"value" : currentStatus, "type": "String"},
												"v_language" : {"value" : userInfos.lang, "type": "String"},


                    };

          _this.$camundaManager.sendMessage(msgName,processVariables, callback);


  }
