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




}
