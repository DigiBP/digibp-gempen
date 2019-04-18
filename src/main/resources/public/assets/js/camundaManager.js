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
        processInstanceID = response.definitionId;
    });

    return processInstanceID;
}
