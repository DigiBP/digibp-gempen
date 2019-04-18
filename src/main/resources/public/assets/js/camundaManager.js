

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
  //constance
  this.BASE_CAMUNDA_URL = "https://gempen.herokuapp.com/rest/";
  this.PROCESS_DEFINITION_ID = "test_process:24:cc280bdb-5c31-11e9-8025-6e16e9d4eabd";
  //global variables
  this.ajaxHelper = new AjaxHelper(this.BASE_CAMUNDA_URL);
  console.log(this.ajaxHelper);
  this.processInstanceID = 0;

  //start

  this.startProcess();

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



    console.log(_this);
    _this.ajaxHelper.postData(requestURL, requestBody, function(response){
        console.log(response);
        _this.processInstanceID =  response.id;
    });


}

CamundaManager.prototype.completeNextTask = function(requestBody){
      var _this = this;
      var success = false;
      console.log("processInstanceID: " +_this.processInstanceID);

      //get open Task list for processInstance first to retrieve ID of task to complete!(should always return only one task)
        var openTaskList = [];
        var requestURL = "task/?processInstanceId="+_this.processInstanceID;
        _this.ajaxHelper.getData(requestURL, function(response){
            console.log(response);
            openTaskList = response;
            var taskIDtoComplete = openTaskList[0].id;

            //complete open task
            success = _this.completeTaskByID(taskIDtoComplete,requestBody);
            if(success){
              alert("hurray");
            }else{
              alert("failed to complete...");
            }
        });




      return success;
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
