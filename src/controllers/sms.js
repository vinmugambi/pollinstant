
var options={
	apiKey: "f80ef4625ced0b688de6b6a37fe80107638bee36a62aeae3866df72fedf35c38",
	username: "wambui",
	format: "json"
}
var africasTalking=require ("africastalking")(options);

exports.sms= function (recepients,message,callback){
	let sms=africasTalking.SMS;
	sms.send({
		to: recepients,
		message: message
	})
	.then((response)=>callback(null,response))
	.catch(error=>callback(error, null));
}

exports.credit= function(recepients,message,callback){
	let credit=africasTalking.AIRTIME;
	credit.send({
		recepients: recepients.map(recepient => {
			return {phoneNumber: recepient, amount: 10}
		})
	})
	.then((response)=>callback(null,response))
	.catch(error=>callback(error, null));
}
