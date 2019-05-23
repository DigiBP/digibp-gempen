/**
* @author: Oliver Faust
* This class handles the camunda api calling. Various api calls are implemented like starting the process, completing tasks and evaluate decison models.
*/

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
//  this.PROCESS_DEFINITION_ID = "test_process:24:cc280bdb-5c31-11e9-8025-6e16e9d4eabd";
  this.PROCESS_DEFINITION_ID = "";
  //global variables
  this.ajaxHelper = new AjaxHelper(this.BASE_CAMUNDA_URL);
  console.log(this.ajaxHelper);
  this.processInstanceID = 0;

  //start

//  this.startProcess();

}


CamundaManager.prototype.startProcess = function(processKey, businessKey, callback){
    var _this = this;


    if(businessKey == undefined)
    {
      businessKey = guid();

    }
    var requestBody =     {
                          "variables":
                            {
                              "incidentLevel" :
                                          { "value" : "low", "type": "String"},
                              "newKB" :
                                          {"value" : true, "type": "Boolean"}
                             },
                            "businessKey" : businessKey
                          };


      //get latest process definition first!
      var requestURLProcess = "process-definition?key="+processKey+"&latestVersion=true";
      _this.ajaxHelper.getData(requestURLProcess, function(response){
                            //set process definition (which process should be triggered)
                            _this.PROCESS_DEFINITION_ID = response[0].id;

                            var requestURL = "process-definition/"+_this.PROCESS_DEFINITION_ID+"/start";
                              //starts the lates process definition
                            _this.ajaxHelper.postData(requestURL, requestBody, function(response){
                                      console.log(response);
                                      _this.processInstanceID =  response.id;
                                      callback();
                              });

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
            console.log("task completed");
      });


}

CamundaManager.prototype.evaluateDMN = function(dmnID, requestBody, callback){
  var _this  = this;
  var requestURL = 'decision-definition/'+dmnID+'/evaluate';

  _this.ajaxHelper.postData(requestURL, requestBody, function(response) {
      console.log(response);
      callback(response);
  });

}

CamundaManager.prototype.sendMessage = function(msgName, processVariables, callback){
  var _this  = this;
  //send msg to waiting catching msg event
  var requestURLResource = "message";
  var  requestBody =     {
            "messageName" : msgName,
            "businessKey" : $processFlowController.businessKey,
            "processInstanceId": _this.processInstanceID,
            processVariables
          };

  _this.ajaxHelper.postData(requestURLResource, requestBody, function(response) {
        console.log("msg sent");


        if(callback != undefined){
          callback();
        }

        if(response != undefined)
        {
          if(response.type == "RestException"){
            alert("You have already opened a ticket!");
          }
        }
  });


}
