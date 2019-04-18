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

ProcessFlowController.prototype.registerEventHandlers = function(){
  console.log("start registering eventhandlers");
  var _this = this;

  $("#testComplete").on("click", function(){
    console.log("testComplete clicked!");
    var requestBody = {"variables":
                        {"incidentLevel":
                          {"value": "high", "type": "string"}
                        }
                      };

    _this.$camundaManager.completeNextTask(requestBody);
  });



}
