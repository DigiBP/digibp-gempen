/**
* @author: Oliver Faust
* Utility functions like making Ajax calls.
*/


function AjaxHelper(baseUrl){
  this.AJAXURL = baseUrl;

}

AjaxHelper.prototype.getData = function(action,handler) {
  var _this = this;
	var requestURI = _this.AJAXURL + action ;


	$.ajax({
		  url: requestURI,
		  method: "GET",
      contentType: "application/json; charset=utf-8",
		  success: handler,
      error:function(response){ console.log("error in GET request"); console.log(response);}
		});
}

AjaxHelper.prototype.postData = function(action,requestBody,handler) {
  var _this = this;
	var requestURI = _this.AJAXURL + action ;


	$.ajax({
    method: "POST",
    url: requestURI,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(requestBody),
    success: handler,
    error: function(response){ console.log("error in POST request"); console.log(response);}
		});
}


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}



function timestamp2Date(lTimestamp) {
	return new Date(lTimestamp * 1000);
}



function formatDateLong(oDate) {
	var strDay = oDate.getDate() < 10 ? "0" + oDate.getDate() : oDate.getDate();
	var iMonth = oDate.getMonth() + 1;
	var strMonth = iMonth < 10 ? "0" + iMonth : iMonth;
	var strDate = strDay + "." + strMonth + "." + oDate.getFullYear();
	strDate += ' ';
	var lHours = oDate.getHours();
	strDate += lHours < 10 ? "0" + lHours : lHours;
	strDate += ':';
	var lMinutes = oDate.getMinutes();
	strDate += lMinutes < 10 ? "0" + lMinutes : lMinutes;
	strDate += ':';
	var lSeconds = oDate.getSeconds();
	strDate += lSeconds < 10 ? "0" + lSeconds : lSeconds;
	return strDate;
}
