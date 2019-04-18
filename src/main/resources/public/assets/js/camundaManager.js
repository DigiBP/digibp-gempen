/*on document ready*/
$( function() {
	var $camundaManager = getCamundaManagerInstance();
});

/*Singleton*/
var $camundaManager = null;
function getCamundaManagerInstance() {

	if ($camundaManager == null) {
		$camundaManager = new CamundaManager();
	}
	return $camundaManager;
}

//CamundaManager Class
function CamundaManager(){

  this.BASE_CAMUNDA_URL = "https://gempen.herokuapp.com/rest/";
  this.PROCESS_DEFINITION_ID = "test_process:24:cc280bdb-5c31-11e9-8025-6e16e9d4eabd";

  this.ajaxHelper = new AjaxHelper(this.BASE_CAMUNDA_URL);
  console.log(this.ajaxHelper);
  this.processInstanceID = this.startProcess();

}

CamundaManager.prototype.startProcess = function(){
    var _this = this;
    var requestURL = "process-definition/"+_this.PROCESS_DEFINITION_ID+"/start";

    var requestBody =     {
                          "variables":
                            {
                              "aVariable" :
                                          { "value" : "aStringValue", "type": "String"},
                              "anotherVariable" :
                                          {"value" : true, "type": "Boolean"}
                             },
                            "businessKey" : "myBusinessKey"
                          };


    var processInstanceID = 0;
    console.log(_this);
    _this.ajaxHelper.postData(requestURL, requestBody, function(response){
        console.log(response);
        processInstanceID = response.id;
    });

    return processInstanceID;
}

CamundaManager.prototype.completeNextTask = function(requestBody){
      var _this = this;

      //get open Task list for processInstance first to retrieve ID of task to complete!(should always return only one task)
      function getOpenTaskList(){

        var requestURL = "task/?processInstanceId="+_this.processInstanceID;
        _this.ajaxHelper.getData(requestURL, function(response){

            console.log(response);
            return response;
          });
      }

      var openTaskList = getOpenTaskList();
      var taskIDtoComplete = openTaskList[0].id;
      //complete open task

      var completed = _this.completeTaskByID(taskIDtoComplete,requestBody);

      if(completed){
        alert("hurray");
      }else{
        alert("failed to complete...");
      }

      return comleted;
}

CamundaManager.prototype.completeTaskByID = function(taskID, requestBody){
      var _this = this;

      //complete open task
      var requestURL = "task/"+taskID+"/complete";
      if(requestBody == undefined){
          //dummy request body
          requestBody = {
                            "variables":
                              {"sample":
                                {"value": "0", "type": "long"}
                              }
                          };
      }

      _this.ajaxHelper.postData(requestURL, requestBody, function(response) {
          console.log(response);
          return true;
      });

      return false;
}
